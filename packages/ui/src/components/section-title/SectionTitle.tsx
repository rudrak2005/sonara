interface SectionTitleProps {
  title: string;
  description?: string;
}

export function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold text-[#F2E9DE]">{title}</h2>
      {description ? (
        <p className="text-sm text-[#B5A69A]">{description}</p>
      ) : null}
    </div>
  );
}
