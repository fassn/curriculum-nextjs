const Projects = () => {
    return (
        <div
            id="projects"
            className="max-w-6xl py-4 px-6 lg:px-8 sm:mx-4 sm:my-4 xl:mx-auto">
            <div>
                <h2>personal projects</h2>
                <hr className="my-4" />
            </div>
            <div className="flex-1 w-full mb-8 p-4 dark:bg-gray-700 rounded">
                Currently working on:
                <br />
                <br />
                <i>An Advanced Civilization (video game) inspired-remake - a full reimplementation in JavaScript.</i>
                <br />
                <br />
                Featuring:
                <ul className="list-disc list-inside">
                    <li>Playable in the browser</li>
                    <li>Updated UI</li>
                    <li>High-Resolution graphics</li>
                    <li>Improved computer AI</li>
                </ul>
            </div>
            <div className="flex">
                <div className="flex-1 max-w-xl mr-2">
                    <a
                        className="text-dark-red dark:text-deep-blue"
                        href="https://christopherfargere.com">
                        christopherfargere.com
                    </a>
                    <br />
                    <br />
                    <i>This website with my updated CV, my portfolio & a blog.</i>
                    <br />
                    <br />
                    Stack:
                    <ul className="list-disc list-inside">
                        <li>NextJS</li>
                        <li>TailwindCSS</li>
                    </ul>
                    <br />
                    Hosting/Database: <br/>
                    <li className="list-item">Firebase</li>
                </div>
                <div className="flex-1 max-w-xl ml-2">
                    <a
                        className="text-dark-red dark:text-deep-blue"
                        href="https://aks-watcher.fly.dev/">
                        AllKeyShop Watcher
                    </a>
                    <br />
                    <br />
                    <i>A dashboard allowing you to track the price of PC & console video games from the AllKeyShop comparison website.</i>
                        <br />
                        <br />
                        Features:
                        <ul className="list-disc list-inside">
                            <li>Scraping data from 3rd-party website</li>
                            <li>Daily recurring queue jobs to update the data</li>
                            <li>Graph showing the price evolution day after day</li>
                            <li>Sorting games by name or price</li>
                        </ul>
                        <br />
                        Stack:
                        <ul className="list-disc list-inside">
                            <li>NextJS</li>
                            <li>TailwindCSS</li>
                            <li>PostgreSQL</li>
                        </ul>
                        <br />
                        Hosting/Database:
                        <li>Fly.io</li>
                </div>
            </div>
        </div>
    )
}

export default Projects