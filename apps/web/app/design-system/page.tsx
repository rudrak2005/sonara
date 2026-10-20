import {
  Badge,
  Button,
  GlassPanel,
  Input,
  SectionTitle,
} from "../../../../packages/ui/src";

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-[#0B0908] px-6 py-12 text-[#F2E9DE]">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="space-y-3">
          <Badge>SONORA DESIGN SYSTEM</Badge>

          <h1 className="text-5xl font-semibold tracking-tight">
            The interface is part of the music.
          </h1>

          <p className="max-w-2xl text-[#B5A69A]">
            Shared visual foundation for the SONORA product.
          </p>
        </header>

        <GlassPanel className="p-6">
          <SectionTitle
            title="Buttons"
            description="Primary interaction hierarchy"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Start My Session</Button>
            <Button variant="secondary">Explore</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <SectionTitle
            title="Inputs"
            description="Form controls"
          />

          <div className="mt-6 max-w-xl">
            <Input placeholder="Search your music..." />
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <SectionTitle
            title="Typography"
            description="SONORA type hierarchy"
          />

          <div className="mt-6 space-y-4">
            <p className="text-5xl font-semibold">
              Display
            </p>

            <p className="text-3xl font-semibold">
              Heading 1
            </p>

            <p className="text-2xl font-semibold">
              Heading 2
            </p>

            <p className="text-base">
              Body text for normal product content.
            </p>

            <p className="text-sm text-[#B5A69A]">
              Supporting information and metadata.
            </p>
          </div>
        </GlassPanel>
      </div>
    </main>
  );
}