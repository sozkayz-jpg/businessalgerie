export function SchemaOrg({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas) }}
    />
  );
}
