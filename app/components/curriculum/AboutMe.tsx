import Image from 'next/image'
import profilePic from '/public/christopher_fargere.jpg'

const AboutMe = () => {
    return (
        <div className="flex max-w-5xl py-4 px-6 lg:px-8 sm:mx-4 xl:mx-auto">
            <div id="about" className="flex flex-col max-w-lg">
                <h1 className="">Christopher Fargere</h1>
                <div className="mt-3 lg:mb-3 lg:mt-auto">
                    Former SEO Specialist. NextJS is what I enjoy most working with these days. Interested in Typescript, PHP and
                    Rust languages.
                    <br />
                    <br />
                    Eager for projects that have a social impact. Trying to
                    avoid next-gen instagram and banking-related projects.
                    <br />
                    <br />
                    Looking forward to help/code for profit & non-profit.
                </div>
            </div>
            <div className="hidden lg:block ml-auto">
                <Image
                    src={profilePic}
                    alt='christopher fargere picture'
                    priority
                />
            </div>
        </div>
    )
}

export default AboutMe