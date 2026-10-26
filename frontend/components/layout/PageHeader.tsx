export default function PageHeader({ title, description, action }: { title:string; description?:string; action?:React.ReactNode }) {
  return <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div><h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>{description && <p className="mt-2 text-sm muted">{description}</p>}</div>
    {action}
  </div>;
}
