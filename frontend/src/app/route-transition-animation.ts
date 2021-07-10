import { trigger, transition, style, query, group, animateChild, animate  } from '@angular/animations';

export const routeTransitionAnimations = trigger('triggerName', [
	transition('Dashboard => Detail, Login => Personalization, Login => Registration, Registration => Personalization, Configuration => Calibration', [
		style({ position: 'relative',}),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				right: 0,
				width: '100%',
			})
		]),
		query(':enter', [style({ 
			right: '-100%', 
			opacity: 0.5,
		 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('0.6s ease-out', style({ opacity: 0.5 }))]),
			query(':enter', [animate('0.3s ease-out', style({ right: '0%', opacity: 1 }))])
		]),
		query(':enter', animateChild())
	]),
	
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
		query(':enter', [style({ opacity: 0.5 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('0.6s ease-out', style({ opacity: 0.5 }))]),
			query(':enter', [animate('0.6s ease-out', style({ opacity: 1 }))])
		]),
		query(':enter', animateChild())
	]),

	transition('Personalization => Login, Registration => Login, Personalization => Registration', [
		style({ position: 'relative',}),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				right: 0,
				width: '100%',
			})
		]),
		query(':leave', [style({ 
			right: '0%', 
			opacity: 1,
			"z-index": 100,
		 })]),
		 query(':enter', [style({ 
			opacity: 0.2,
		 })]),
		query(':leave', animateChild()),
		group([
			query(':enter', [animate('0.6s ease-out', style({ opacity: 1 }))]),
			query(':leave', [animate('0.3s ease-out', style({ right: '-100%', opacity: 0 }))])
		]),
		query(':enter', animateChild())
	]),
]);