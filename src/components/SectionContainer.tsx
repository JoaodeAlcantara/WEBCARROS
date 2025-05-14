import { ReactNode } from "react"


function SectionContainer({children}: {children: ReactNode}){
    return (
        <div className="mt-15 sm:ml-20 sm:mt-5 2xl:ml-0">
            {children}
        </div>
    )
}

export default SectionContainer