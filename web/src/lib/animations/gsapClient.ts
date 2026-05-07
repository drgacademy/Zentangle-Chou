import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { browser } from '$app/environment';

let registered = false;

export function getGsap() {
  if (browser && !registered) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power2.out' });
    registered = true;
  }
  return gsap;
}

export { ScrollTrigger };
