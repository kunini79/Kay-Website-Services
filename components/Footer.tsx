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
            <div className="w-full bg-black pb-[10vh] pt-0 max-md:pt-[5vh] overflow-clip relative min-h-screen flex flex-col justify-end px-4 md:px-[3vw]">
                <h2 className="text-white text-[22vw] md:text-[29vw] leading-none font-display uppercase text-center relative z-20 font-bold">
                    KayCorp
                </h2>

                {/* Social Links / Contact Info */}
                <div className="flex justify-center gap-8 mt-12 relative z-20">
                    <a href="/contact" className="text-white/60 hover:text-lime-400 transition-colors font-sans text-sm uppercase tracking-wider">
                        Contact
                    </a>
                    <span className="text-white/30">•</span>
                    <a href="/#services" className="text-white/60 hover:text-lime-400 transition-colors font-sans text-sm uppercase tracking-wider">
                        Services
                    </a>
                    <span className="text-white/30">•</span>
                    <a href="/#work" className="text-white/60 hover:text-lime-400 transition-colors font-sans text-sm uppercase tracking-wider">
                        Work
                    </a>
                </div>

                <p className="text-center text-white/40 mt-8 text-xs md:text-sm font-sans relative z-20">
                    © 2026 KayCorp. All rights reserved.
                </p>

                <svg className="absolute bottom-[3vw] left-[3vw] w-6 h-6 text-white/30 z-50 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <svg className="absolute bottom-[3vw] right-[3vw] w-6 h-6 text-white/30 z-50 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
        </section>
    );
}
