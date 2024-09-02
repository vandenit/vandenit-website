import Link from "next/link";
import { useState } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

export const TagFilterPanel = ({
    tags
}: {
    tags: string[];
}) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex flex-col space-y-4 m-5">
            <div className="flex items-center justify-between">
                <button className={`text-sm text-gray-600 ${isCollapsed ? 'hidden' : ''}`} onClick={handleToggleCollapse}>
                    Hide Tags <FaAngleUp />
                </button>
                <button className={`text-sm text-gray-600 ${isCollapsed ? '' : 'hidden'}`} onClick={handleToggleCollapse}>
                    Show All Tags <FaAngleDown />
                </button>
            </div>
            <div className={`flex flex-wrap -m-1 ${isCollapsed ? 'hidden' : ''}`}>
                {tags.map((tag) => (
                    <span key={tag} className="badge ml-2 text-xs font-semibold">
                        <Link href={`/posts?tag=${tag}`}>{tag}</Link>
                    </span>
                ))}
            </div>
        </div>
    );
}
