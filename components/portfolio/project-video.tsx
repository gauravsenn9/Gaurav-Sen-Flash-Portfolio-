import workradarMp4 from '@/assets/thumbs/video-workradar.asset.json';
import sahiMp4 from '@/assets/thumbs/video-sahi.asset.json';
import workradarWebm from '@/assets/thumbs/video-workradar-webm.asset.json';
import sahiWebm from '@/assets/thumbs/video-sahi-webm.asset.json';

export function ProjectVideo({ title, src }: { title: string; src: string }) {
  const fallback = src === workradarMp4.url ? workradarWebm.url : src === sahiMp4.url ? sahiWebm.url : undefined;
  return <div className="project-video"><video title={`${title} animated walkthrough`} aria-label={`${title} animated walkthrough`} autoPlay muted loop playsInline preload="auto" disablePictureInPicture><source src={src} type="video/mp4"/>{fallback&&<source src={fallback} type="video/webm"/>}</video></div>;
}
