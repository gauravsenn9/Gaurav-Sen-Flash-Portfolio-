/** Original vector artwork: each limb segment rotates around its own joint. */
export function Speedster() {
  return <g data-character="speedster">
    <g data-joint="left-thigh"><Leg side="left"/></g>
    <g data-joint="right-thigh"><Leg side="right"/></g>
    <Arm side="left"/><Arm side="right"/>
    <path d="M-39-132Q-52-120-45-93L-30-44L-26-12Q0 2 26-12L30-44L45-93Q52-120 39-132L19-139H-19Z" fill="url(#speedster-suit)" stroke="var(--intro-shadow)" strokeWidth="2"/>
    <path d="M-37-120Q-20-130-5-112L-4-85Q-25-87-37-98ZM37-120Q20-130 5-112L4-85Q25-87 37-98Z" fill="var(--intro-highlight)" opacity=".55"/>
    <path d="M-29-75L-6-69M29-75L6-69M-25-58L-5-54M25-58L5-54M-23-39L-3-35M23-39L3-35" fill="none" stroke="var(--intro-shadow)" strokeWidth="3" opacity=".5"/>
    <path d="M-29-27L-16-23L-8-27L0-23L8-27L16-23L29-27" fill="none" stroke="var(--intro-gold)" strokeWidth="6" strokeLinejoin="miter"/>
    <path d="M-18-140V-126Q0-114 18-126V-140" fill="var(--intro-suit)" stroke="var(--intro-shadow)" strokeWidth="2"/>
    <path d="M-24-153Q-31-172-26-191Q-19-210 0-212Q19-210 26-191Q31-172 24-153L14-136H-14Z" fill="url(#speedster-suit)" stroke="var(--intro-shadow)" strokeWidth="2"/>
    <path d="M-16-159L-12-145Q0-133 12-145L16-159L8-163L0-157L-8-163Z" fill="var(--intro-skin)"/>
    <path d="M-20-179L-4-175L-7-168L-18-172ZM20-179L4-175L7-168L18-172Z" fill="var(--hero-text)"/>
    <path d="M0-191V-162M-8-149Q0-146 8-149" stroke="var(--intro-shadow)" strokeWidth="2" fill="none"/>
    <path d="M-26-181L-36-173L-29-173L-37-158L-23-170M26-181L36-173L29-173L37-158L23-170" fill="var(--intro-gold)"/>
    <path d="M-18-194Q0-207 18-194" fill="none" stroke="var(--intro-highlight)" strokeWidth="3"/>
    <circle cy="-104" r="17" fill="var(--hero-text)" stroke="var(--intro-gold)" strokeWidth="2"/>
    <path d="M4-119L-11-101H-1L-5-88L12-107H2Z" fill="var(--intro-gold)" stroke="var(--intro-shadow)" strokeWidth=".7"/>
  </g>;
}
function Arm({side}: {side: string}) {
  return <g data-joint={`${side}-arm`}>
    <path d="M-13 0Q-20 22-12 43L-9 61H9L12 43Q20 22 13 0Z" fill="url(#speedster-suit)" stroke="var(--intro-shadow)" strokeWidth="2"/>
    <path d="M-8 9Q-13 26-7 41" fill="none" stroke="var(--intro-highlight)" strokeWidth="3"/>
    <g data-joint={`${side}-forearm`}>
      <path d="M-10 0Q-17 24-8 52L-7 65H7L8 52Q17 24 10 0Z" fill="url(#speedster-suit)" stroke="var(--intro-shadow)" strokeWidth="2"/>
      <path d="M-10 44L-2 48L-7 53L9 49" fill="none" stroke="var(--intro-gold)" strokeWidth="4"/>
    </g>
    <g data-hand={side}><path d="M-8-7Q-13 2-7 9L4 11Q12 9 10 1L7-8Z" fill="var(--intro-suit)" stroke="var(--intro-shadow)" strokeWidth="2"/><path d="M-4-5L-3 4M1-5L2 4M6-4L7 3" stroke="var(--intro-highlight)" strokeWidth="1.5"/></g>
  </g>;
}
function Leg({side}: {side: string}) {
  return <><path d="M-15 0Q-23 31-13 62L-10 78H10L13 62Q23 31 15 0Z" fill="url(#speedster-suit)" stroke="var(--intro-shadow)" strokeWidth="2"/><path d="M-9 12L-10 45" stroke="var(--intro-highlight)" strokeWidth="3"/><g data-joint={`${side}-shin`}><path d="M-10 0Q-17 20-10 45L-8 77H8L10 45Q17 20 10 0Z" fill="url(#speedster-suit)" stroke="var(--intro-shadow)" strokeWidth="2"/><path d="M-11 44L-1 49L-7 55L11 50L9 78L24 87Q28 96 18 97H-9L-11 85Z" fill="var(--intro-gold)" stroke="var(--intro-shadow)" strokeWidth="2"/><path d="M-4 60L-3 81" stroke="var(--hero-text)" strokeWidth="2" opacity=".5"/></g></>;
}