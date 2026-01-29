export default function Footer() {
    return (
        <section>
            <div className="relative z-[100] mt-[-35vh] pointer-events-none">
                <div className="h-[40vh] w-full flex pointer-events-none">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="box mt-[1vh] flex-1 bg-black origin-bottom"></div>
                    ))}
                </div>
            </div>

            {/* Footer Content */}
            <div className="w-full bg-black pb-[10vh] pt-0 max-md:pt-[5vh] overflow-clip relative min-h-screen flex flex-col justify-end">
                {/* Scrolling Sticky Text Placeholder */}
                <div className="h-screen w-full absolute inset-0 flex justify-center items-center z-10 opacity-50 pointer-events-none">
                    {/* This would ideally assume scroll interactions to show/hide these */}
                    <div className="absolute text-white/20 text-[5vw] top-10">Built different</div>
                    <div className="absolute text-white/20 text-[5vw] bottom-10">Innovate always</div>
                </div>

                <h2 className="text-white text-[29vw] leading-none font-display uppercase text-center relative z-20">
                    KayCorp
                </h2>

                <svg className="absolute bottom-[3vw] left-[3vw] w-6 h-6 text-white z-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <svg className="absolute bottom-[3vw] right-[3vw] w-6 h-6 text-white z-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
        </section>
    );
}
