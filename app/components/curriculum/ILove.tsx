const ILove = () => {
    return (
        <div
            id="ilove"
            className="max-w-6xl sm:my-4 py-4 px-6 lg:px-8 sm:mx-4 xl:mx-auto">
            <div>
                <h2>I ♥</h2>
                <hr className="my-4" />
            </div>
            <div className="flex">
                <div className="flex-1 mr-2">
                    <h3>Ocean Cleanup Project</h3>
                    <div className="text-left">
                        The Ocean Cleanup develops advanced technologies to rid
                        the world’s oceans of plastic. A full-scale deployment
                        of our systems is estimated to clean up 50 % of the
                        Great Pacific Garbage Patch in 5 years.
                        <br />
                        <br />
                    </div>
                    <div>
                        <a
                            className="text-dark-red dark:text-deep-blue"
                            href="https://www.theoceancleanup.com/">
                            Ocean Cleanup Project
                        </a>
                    </div>
                </div>
                <div className="flex-1 ml-2">
                    <h3>Bayes Impact</h3>
                    <div className="text-left">
                        Bayes Impact builds the social services of the future.
                        Leveraging software and data science to deliver
                        personalized and scalable interventions for millions of
                        underserved people across the world.
                        <br />
                        <br />
                    </div>
                    <div>
                        <a
                            className="text-dark-red dark:text-deep-blue"
                            href="https://www.bayesimpact.org/">
                            Bayes Impact
                        </a>
                    </div>
                </div>
                {/* <div className="ilove-c">
                    <h3>Mes aides UI</h3>
                    <div>Open-Source project for french social grants.<br /><br />
                    </div>
                    <div>
                        <a className="link-color" href="https://mes-aides.gouv.fr/">Mes aides</a>
                    </div>
                    <hr />
                </div>
                <div className="ilove-d">
                    <h3>FarmBot</h3>
                    <div>Humanity's first Open-Source CNC Farming Machine<br /><br />
                    </div>
                    <div>
                        <a className="link-color" href="https://farmbot.io/">FarmBot</a>
                    </div>
                    <hr />
                </div> */}
            </div>
            <hr className="hidden sm:block mt-4" />
        </div>
    )
}

export default ILove