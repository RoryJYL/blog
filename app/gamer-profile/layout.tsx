import { GamerProfileNav } from '@/components/gamer-profile-nav'

export default function GamerProfileLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="mx-auto px-6 md:px-4 pt-4 pb-6 xl:max-w-7xl md:max-w-5xl md:min-h-[calc(100vh-56px-168px)]">
      <GamerProfileNav />
      {children}
    </div>
  )
}
