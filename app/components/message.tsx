import { UserCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Message({ role, message }: { role: string, message: string }) {
    return (
        <div className='block mb-2 pt-6 text-sm font-medium text-gray-900 dark:text-white'>
            {role === "user" ? <UserCircleIcon className="h-6 w-6 inline-block" /> : <SparklesIcon className="h-6 w-6 inline-block" />}
            <Markdown remarkPlugins={[remarkGfm]} className="inline-block ml-2 bg-slate-500 rounded-3xl p-1 text-wrap" components={{ a: props => <a href={props.href} className="text-blue-700 underline font-bold">{props.children}</a> }}>{message}</Markdown>
        </div>
    )
}