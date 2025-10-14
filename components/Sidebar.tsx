import { UserButton } from '@stackframe/stack';
import { BarChart3, Package, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
// todo: update the sidebar to be dynamic with group folder
const Sidebar = ({ currentPath = '/dashboard' }: { currentPath: string }) => {

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className='fixed left-0 top-0 min-h-screen w-64 text-white p-6 z-10 bg-gray-900'>
      <div className="mb-8">
        <div className='flex items-c enter space-x-2 mb-4'>
          <BarChart3 className='w-6 h-6' />
          <span className='text-lg font-semibold'>Invem</span>
        </div>
      </div>

      <nav className='space-y-1'>
        <div className='text-sm font-medium text-gray-400 uppercase'>Inventory</div>
        {navigation.map((item, key) => {
          const IconComponent = item.icon;
          const isActive = item.href === currentPath;
          return (
            <Link
              href={item.href}
              key={key}
              className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${isActive
                ? "bg-purple-100 text-gray-800"
                : "hover:bg-gray-800 text-gray-300"
                }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 borter-t border-gray-700">
        <div className="flex items-center justify-between">
          <UserButton showUserInfo />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
