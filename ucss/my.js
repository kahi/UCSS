/* JavaScript Document
 *********************/

//@todo maybe add something like @import jq.js here - to load jQ only if it's needed (by settings) - but how?



$(document).ready(function(){
	
	
	if (kucss_autoanchors || kucss_breadcrumbs) {
	
		// headings...
		$('h2, h3, h4, h5, h6').each(function(i, e){

			// wrap original content [anyway]
			$(this).wrapInner('<span class="h"></span>');


			// add section anchor link [if enabled]
			if (kucss_autoanchors) {
				if ($(this).attr('id'))
					$(this).wrapInner('<a href="#'+ $(this).attr('id') +'" title="link to this section" class="anchor"></a>');
			}


			// add breadcrumbs [if enabled]
			if (kucss_breadcrumbs) {

				var h_level = e.nodeName.substr(1,1);
				var bc = '[Document]';

				if (h_level >= 2) {
					for (var i = 2; i <= h_level; i++){

						if (i == h_level) // last
							bc += ' &rarr; ' + $(this).text();
						else
							bc += ' &rarr; ' + $(this).prevAll('h' + i).eq(0).find('.h').text();

					}

					$(this).append(' <span class="bc">' + bc + '</span>');
				}

			}

		});

	}


	// add skip-to-top link [anyway]
	$('body').attr('id', 'top').append('<a href="#top" id="to-top">&uArr; Top</a>');


	// fix links to files [anyway]
	$('a > img').parent().addClass('linking-image');


	// blockcode: select all
		// add button
	$('pre:has(code), code.block')
		.css('position', 'relative')
		.append('<button class="select-all">Select all</button>');

		// make button work
	var setting_blockcode_top_nodename = 'pre'; // e.g. change to 'div' if you write block code into div.myblockcode > code
	var blockcode_textarea_counter = 0;

	$('button.select-all').click(function(){

		// The button's text should not be in the textarea. Temporary hiding into its title attribute.
		$('button.select-all[title]').each(function(){
			$(this).text($(this).attr('title')).removeAttr('title');
		});
		$(this).attr('title', $(this).text()).text('');

		// Hide other textareas and show their originals
		$('.hidden-code').show();
		$('textarea.blockcode').remove();

		var parent = $(this).parent(setting_blockcode_top_nodename);
		blockcode_textarea_counter++;

		// Add textarea and hide original
		parent
			.after('<textarea class="blockcode" readonly="readonly" id="blockcode_'+ blockcode_textarea_counter +'">' + parent.text() + '</textarea>')
			.addClass('hidden-code')
			.hide();

		// Focus the new textarea and select its content
		$('#blockcode_'+blockcode_textarea_counter)
			.css('height', parent.innerHeight() + 'px')
			.focus()
			.select();

	});


});

