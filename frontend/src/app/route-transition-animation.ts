import { trigger, transition, style, query, group, animateChild, animate  } from '@angular/animations';

export const routeTransitionAnimations = trigger('triggerName', [
	transition('Dashboard => Detail', [
		style({ position: 'relative' }),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				right: 0,
				width: '100%'
			})
		]),
		query(':enter', [style({ right: '-100%', opacity: 0.5 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('0.6s ease-out', style({ right: '50%', opacity: 0.5 }))]),
			query(':enter', [animate('0.3s ease-out', style({ right: '0%', opacity: 1 }))])
		]),
		query(':enter', animateChild())
	]),
    // transition('Dashboard => Detail', [
    //     query(':enter, :leave', style({ position: 'fixed'}), { optional: true }),
    //     group([
    //       query(':enter', [style({ transform: 'translateX(100%)' }), animate('.7s ease-out', style({ transform: 'translateX(0%)' }))], {
    //         optional: true,
    //       }),
    //       query(':leave', [style({ transform: 'translateX(0%)' }), animate('.7s ease-out', style({ transform: 'translateX(-100%)' }))], {
    //         optional: true,
    //       }),
    //     ]),
    //   ]),

    // transition('Dashboard => Detail', [
    //     query(':enter', [
    //         style({ opacity: 0, transform: 'translateX(100%)' }),
    //         animate(
    //             '300ms ease-in',
    //             style({ opacity: 1, transform: 'translateX(0)' })
    //         ),
    // 	]),
	//     query(':leave', [
    //         animate(
    //             '300ms ease-in',
    //             style({ opacity: 0, transform: 'translateX(-100px)' })
    //         ),
	//     ]),
    // ]),
	transition('Detail => Dashboard', [
		style({ position: 'relative' }),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%'
			})
		]),
		query(':enter', [style({ left: '-100%', opacity: 0 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('0.6s ease-out', style({ left: '50%', opacity: 0 }))]),
			query(':enter', [animate('0.3s ease-out', style({ left: '0%', opacity: 1 }))])
		]),
		query(':enter', animateChild())
	])
]);