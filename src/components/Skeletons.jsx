export const SectionSkeleton = ({ height = '100vh', isMobile }) => (
  <div 
    style={{ 
      height, 
      width: '100%', 
      padding: isMobile ? '40px 24px' : '80px 48px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      opacity: 0.6
    }}
  >
    <div className="animate-pulse" style={{ width: '40%', height: '48px', backgroundColor: '#d1d5db', borderRadius: '8px' }} />
    <div className="animate-pulse" style={{ width: '80%', height: '24px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginTop: '20px' }} />
    <div className="animate-pulse" style={{ width: '60%', height: '24px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
    <div className="animate-pulse" style={{ width: '70%', height: '24px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
  </div>
);

export const HeroSkeleton = ({ isMobile }) => <SectionSkeleton height={isMobile ? 'auto' : '100vh'} isMobile={isMobile} />;
export const AboutSkeleton = ({ isMobile }) => <SectionSkeleton height={isMobile ? 'auto' : '60vh'} isMobile={isMobile} />;
export const ExperienceSkeleton = ({ isMobile }) => <SectionSkeleton height={isMobile ? 'auto' : '80vh'} isMobile={isMobile} />;
export const EducationSkeleton = ({ isMobile }) => <SectionSkeleton height={isMobile ? 'auto' : '60vh'} isMobile={isMobile} />;
export const WorksSkeleton = ({ isMobile }) => <SectionSkeleton height={isMobile ? 'auto' : '80vh'} isMobile={isMobile} />;
export const TestimonialsSkeleton = ({ isMobile }) => <SectionSkeleton height={isMobile ? 'auto' : '60vh'} isMobile={isMobile} />;
export const ContactSkeleton = ({ isMobile }) => <SectionSkeleton height={isMobile ? 'auto' : '50vh'} isMobile={isMobile} />;
