import Image from 'next/image'
import profilePic from '/public/christopher_fargere.jpg'

const AboutMe = () => {
    return (
        <div className="flex max-w-6xl py-4 px-6 lg:px-8 sm:mx-4 xl:mx-auto">
            <div id="about" className="flex flex-col max-w-lg">
                <h1 className="my-5">Christopher Fargere</h1>
                <div className="mt-auto">
                    SEO Specialist in reconversion. Love PHP, Typescript and
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
            <div className="hidden lg:block mx-auto">
                <Image
                    src={profilePic}
                    layout='intrinsic'
                    alt='christopher fargere picture' />
                {/* <UnoptimizedImage
                    props={{
                        src: profilePic,
                        unoptimized: true,
                        layout: 'intrinsic',
                        alt: 'christopher fargere picture',
                    }}
                /> */}
            </div>
        </div>
    )
}

export default AboutMe