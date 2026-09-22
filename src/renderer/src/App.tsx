import { AppShell } from '@renderer/components/fleet/app-shell'
import { FleetProvider } from '@renderer/lib/store'
import { ThemeProvider } from '@renderer/lib/theme'

export default function Page() {
  return (
    <ThemeProvider>
      <FleetProvider>
        <AppShell />
      </FleetProvider>
    </ThemeProvider>
  )
}
