import { createClient } from '@supabase/supabase-js'
import { Octokit } from '@octokit/rest'
import { NextResponse } from 'next/server'
import { gzipSync } from 'zlib'

const TABLES = ['users', 'foods', 'preferences', 'days', 'meals', 'meal_items', 'user_foods', 'meal_presets']

// Exclude sensitive fields from backup
const EXCLUDED_FIELDS: Record<string, string[]> = {
  users: ['apple_user_id', 'cloudkit_id', 'device_ids']
}

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })

    const timestamp = new Date().toISOString().split('T')[0]
    const owner = process.env.GITHUB_OWNER!
    const repo = process.env.GITHUB_BACKUP_REPO!

    const results: { table: string; rows: number; size: number }[] = []

    // Backup each table as a separate file
    for (const table of TABLES) {
      const allRows: unknown[] = []
      let offset = 0
      const limit = 1000

      // Fetch with pagination
      while (true) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .range(offset, offset + limit - 1)

        if (error) {
          console.error(`Error fetching ${table}:`, error)
          break
        }

        if (!data || data.length === 0) break

        // Filter out excluded fields
        if (EXCLUDED_FIELDS[table]) {
          for (const row of data) {
            const filtered = { ...row }
            for (const field of EXCLUDED_FIELDS[table]) {
              delete filtered[field]
            }
            allRows.push(filtered)
          }
        } else {
          allRows.push(...data)
        }

        if (data.length < limit) break
        offset += limit
      }

      // Compress and upload this table
      const content = JSON.stringify(allRows)
      const compressed = gzipSync(Buffer.from(content))
      const encodedContent = compressed.toString('base64')

      const path = `backups/${timestamp}/${table}.json.gz`

      // Check if file exists
      let sha: string | undefined
      try {
        const { data: existingFile } = await octokit.repos.getContent({
          owner,
          repo,
          path
        })
        if ('sha' in existingFile) {
          sha = existingFile.sha
        }
      } catch {
        // File doesn't exist
      }

      // Upload
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Backup ${table} ${timestamp}`,
        content: encodedContent,
        sha
      })

      results.push({ table, rows: allRows.length, size: compressed.length })
    }

    // Cleanup old backups
    await cleanupOldBackups(octokit, owner, repo)

    return NextResponse.json({
      success: true,
      timestamp,
      tables: results
    })

  } catch (error) {
    console.error('Backup error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      error: 'Backup failed',
      details: errorMessage,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasGithubToken: !!process.env.GITHUB_TOKEN,
      hasGithubOwner: !!process.env.GITHUB_OWNER,
      hasGithubRepo: !!process.env.GITHUB_BACKUP_REPO
    }, { status: 500 })
  }
}

async function cleanupOldBackups(octokit: Octokit, owner: string, repo: string) {
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'backups'
    })

    if (!Array.isArray(contents)) return

    // Get all date folders
    const folders = contents
      .filter(f => f.type === 'dir' && /^\d{4}-\d{2}-\d{2}$/.test(f.name))
      .map(f => f.name)
      .sort((a, b) => b.localeCompare(a))

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    const toKeep = new Set<string>()
    const weeklyKept = new Set<string>()
    const monthlyKept = new Set<string>()

    for (const folder of folders) {
      const folderDate = new Date(folder)

      // Keep all from last 30 days
      if (folderDate >= thirtyDaysAgo) {
        toKeep.add(folder)
        continue
      }

      // Keep one per week for 30-90 days
      if (folderDate >= ninetyDaysAgo) {
        const weekKey = getWeekKey(folderDate)
        if (!weeklyKept.has(weekKey)) {
          weeklyKept.add(weekKey)
          toKeep.add(folder)
        }
        continue
      }

      // Keep one per month for older
      const monthKey = `${folderDate.getFullYear()}-${folderDate.getMonth()}`
      if (!monthlyKept.has(monthKey)) {
        monthlyKept.add(monthKey)
        toKeep.add(folder)
      }
    }

    // Delete folders not in toKeep
    for (const folder of folders) {
      if (!toKeep.has(folder)) {
        await deleteFolder(octokit, owner, repo, `backups/${folder}`)
      }
    }

    // Also clean up old single-file backups if any exist
    const oldFiles = contents.filter(f => f.name.endsWith('.json') || f.name.endsWith('.json.gz'))
    for (const file of oldFiles) {
      await octokit.repos.deleteFile({
        owner,
        repo,
        path: `backups/${file.name}`,
        message: `Cleanup old backup ${file.name}`,
        sha: file.sha
      })
    }
  } catch (error) {
    console.error('Cleanup error:', error)
  }
}

async function deleteFolder(octokit: Octokit, owner: string, repo: string, path: string) {
  try {
    const { data: contents } = await octokit.repos.getContent({ owner, repo, path })
    if (!Array.isArray(contents)) return

    for (const file of contents) {
      if (file.type === 'file') {
        await octokit.repos.deleteFile({
          owner,
          repo,
          path: file.path,
          message: `Cleanup ${file.path}`,
          sha: file.sha
        })
      }
    }
  } catch (error) {
    console.error(`Error deleting folder ${path}:`, error)
  }
}

function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return `${year}-W${week}`
}
