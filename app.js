'use strict'

let fiddles = [
	'1 + 2',
	'(function() {return 7})()',
	'[1, 2, 3]',
	'"Hello".split("").reverse().join("")',
	'alert("Hi!")'
]

let selectedSegment
const { Element } = require('mare-dom')
require('./app.css')

const list = fiddles => {
	return fiddles.map((fiddle, i) => {
		let segment = new Element('div')
			.addClass('segment')

		let el = new Element('input', fiddle)
			.attr('type', 'text')
			.render()

		let evalEl = new Element('p')
			.addClass('eval')
			.render()


		el.on('keyup', function (e) {
			if (e.ctrlKey && e.keyCode == 13) {
				evalEl.content(eval(el.value()))
			}
		})

		el.on('focus', function () {
			selectedSegment = segment
			segment.addClass('active')
		})

		el.on('blur', function () {
			segment.removeClass('active')
		})

		return segment.addChild([el, evalEl])
			.attr('key', i)
			.render()
	})
}

let segments = new Element('div')
	.addChild(list(fiddles))
	.render()

let popup = new Element('div')
	.addClass('popup')
	.render()

let actions = [
	{
		description: "Adds a segment to your current list",
		action: "ADD_SEGMENT",
		title: "Add segment",
		shortcut: "Ctrl+Alt+A"
	},
	{
		description: "Deletes a segment from your current list",
		action: "DELETE_SEGMENT",
		title: "Delete segment",
		shortcut: "Ctrl+Alt+D"
	},
	{
		description: "Evaluates the selected segment",
		action: "EVALUATE_SEGMENT",
		title: "Evaluate segment",
		shortcut: "Ctrl+Alt+D"
	}
]


let buttons = actions.map(action => {
	let title = new Element('h3', action.title).render()

	let description = new Element('p', action.description).render()

	let shortcut = new Element('footer', action.shortcut).render()

	let out = new Element('div')
		.addClass('command')
		.addChild(title, description, shortcut)

	switch (action.action) {
		case 'ADD_SEGMENT':
			return out
				.on('click', e => addSegment())
				.render()
		case 'DELETE_SEGMENT':
			return out
				.on('click', e => deleteSegment(selectedSegment.el.getAttribute('key')))
				.render()
		case 'EVALUATE_SEGMENT':
			return out
				.on('click', e => selectedSegment
					.children()[1]
					.content(
					eval(selectedSegment.children()[0]
						.value())
					)
				)
				.render()
	}
	return out
})

popup.addChild(buttons)

window.addEventListener('keyup', e => {
	if (e.ctrlKey && e.altKey) {
		switch (e.keyCode) {
			case 80:
				popup.toggleClass('active')
				segments.toggleClass('blur')
				break
			case 65:
				addSegment()
				break
			case 68:
				deleteSegment(selectedSegment.el.getAttribute('key'))
				break
		}
	} else {
		if(e.keyCode == 27) {
			if(popup.el.classList.contains('active')) {
				popup.removeClass('active')
				segments.toggleClass('blur')
			}
		}
	}
})

function addSegment() {
	fiddles.push('2 + 2')
	document.body.innerHTML = ''
	segments = new Element('div')
		.addChild(list(fiddles))
		.render()
	popup
		.removeClass('active')
		.render()
}

function deleteSegment(key) {
	let els = list(fiddles)
	els.forEach(el => {
		if (el.el.getAttribute('key') == key) {
			fiddles.splice(key, 1)
		}
	})
	document.body.innerHTML = ''
	segments = new Element('div')
		.addChild(list(fiddles))
		.render()
	popup
		.removeClass('active')
		.render()
}