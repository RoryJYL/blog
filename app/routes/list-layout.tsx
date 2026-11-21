import { Outlet } from 'react-router'
import MainLayout from '@/app/components/main-layout'
import { PostList } from '@/app/components/post-list'

/** 文章 / 絮语列表页共用的三栏布局：左栏目录，中栏内容 */
export default function ListLayout() {
  return <MainLayout left={<PostList />} main={<Outlet />} />
}
