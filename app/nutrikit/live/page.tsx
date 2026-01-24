import { Metadata } from 'next';
import LiveTerminalPage from './LiveTerminalPage';

export const metadata: Metadata = {
  title: 'Live Terminal - NutriKit',
  description: 'Watch the live terminal session',
};

export default function Page() {
  return <LiveTerminalPage />;
}
