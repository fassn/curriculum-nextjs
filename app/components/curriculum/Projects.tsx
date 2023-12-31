const Projects = () => {
    return (
        <div
            id="projects"
            className="max-w-6xl py-4 px-6 lg:px-8 sm:mx-4 sm:my-4 xl:mx-auto">
            <div>
                <h2>personal projects</h2>
                <hr className="my-4" />
            </div>
            <div className="flex-1 w-full mb-10 p-4 dark:bg-gray-700 rounded">
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
            <div className="flex flex-wrap">
                <div className="mb-8 lg:w-1/2 lg:pr-2">
                    <div className="flex">
                        <a
                            className="text-dark-red dark:text-deep-blue"
                            href="https://christopherfargere.com">
                            christopherfargere.com
                        </a>
                        <a href="https://github.com/fassn/curriculum-nextjs" className="ml-4" target="_blank">
                            <svg className="fill-[#24292f] dark:fill-white" width="25" height="24" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
                            </svg>
                        </a>
                    </div>
                    <br />
                    <i>This website with my updated CV, my portfolio & a blog.</i>
                    <br />
                    <br />
                    Features:
                    <ul className="list-disc list-inside">
                        <li>Responsive layout</li>
                        <li>Dark/Light Theme</li>
                        <li>Admin authentication</li>
                        <li>REST API to manage the blog</li>
                    </ul>
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
                <div className="mb-8 lg:w-1/2 lg:pl-2">
                    <div className="flex">
                        <a
                            className="text-dark-red dark:text-deep-blue"
                            href="https://aks-watcher.fly.dev/">
                            AllKeyShop Watcher
                        </a>
                        <a href="https://github.com/fassn/aks-watcher" className="ml-4" target="_blank">
                            <svg className="fill-[#24292f] dark:fill-white" width="25" height="24" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
                            </svg>
                        </a>
                    </div>
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
                <div className="mb-8 lg:w-1/2 lg:pr-2">
                    <div className="flex">
                        <a
                            className="text-dark-red dark:text-deep-blue"
                            href="https://red-tetris.fly.dev/">
                            Red Tetris
                        </a>
                        <a href="https://github.com/fassn/red-tetris" className="ml-4" target="_blank">
                            <svg className="fill-[#24292f] dark:fill-white" width="25" height="24" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
                            </svg>
                        </a>
                    </div>
                    <br />
                    <i>A multiplayer reimplementation of classic Tetris.<br />
                    NB: This is currently a MVP. Planning to add more features - time-attack mode, speed levels, highscore board, etc.</i>
                    <br />
                    <br />
                    Features:
                    <ul className="list-disc list-inside">
                        <li>Solo or 2-player games over websockets</li>
                        <li>A lobby with a live chat to taunt your opponent & get ready</li>
                        <li>Animated end-screen for the winner</li>
                    </ul>
                    <br />
                    Stack:
                    <ul className="list-disc list-inside">
                        <li>NextJS</li>
                        <li>TailwindCSS</li>
                        <li>P5JS</li>
                        <li>SocketIO</li>
                    </ul>
                    <br />
                    Hosting/Database:
                    <li>Fly.io</li>
                </div>
                <div className="mb-8 lg:w-1/2 lg:pl-2">
                    {/* Add new project here */}
                </div>
            </div>
        </div>
    )
}

export default Projects