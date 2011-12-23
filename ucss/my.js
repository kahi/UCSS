/* JavaScript Document
 *********************/

//@todo maybe add something like @import jq.js here - to load jQ only if it's needed (by settings) - but how?

;
(function($){
                                               
    /**
     * Based on a part of the Sleek-PHP framework
     * Adapted by: Ondrej Slamecka, www.slamecka.cz         
     * http://code.google.com/p/sleek-php/source/browse/trunk/Sites/SleekBase/Modules/Base/JS/jQuery.generateDocumentOutline.js
     */
    $.fn.createDocumentOutline = function (options) {               
        
        // Referring to this object
        OutlineCreator = this;
        
        /* --- OPTIONS --- */
        
        this.defaultoptions = {
            placing : $('#toc'), // After which element will the table of contents be placed
            startLevel : 2, // First level of headers in the table
            endLevel : 2 // Last included level of headers
        };
        
        /* --- METHODS --- */
        
        this.createOutline = function (headings) {
                               
            var ol = $(document.createElement('ol'));
            
            // Go trough the each selected heading
            headings.each(function (i) {
                
                // The heading, its level and unique id
                var heading = $(this);
                var currentLevel = parseInt(heading[0].nodeName.substr(1),10);
                // TODO: Improve regexp to sanitize URLs properly                                                  
                var id = 'toc-' + (heading.text().replace(/ /g, '-').toLowerCase()); // + '-'  + currentLevel + '-' + i;
                heading.attr('id', id);
                                
                if (currentLevel === OutlineCreator.options.startLevel) {
                    // TODO: Better set id #toc-table and change CSS (?) 
                    ol.addClass('important'); 
                }
                
                // The list item
                if (currentLevel <= OutlineCreator.options.endLevel) {
                    var li = $(document.createElement('li'));
                    ol.append(li);
                }
                                
                // The link within the list item
                var a = $(document.createElement('a'));
                a.attr('href', '#' + id);
                a.text(heading.text());                
                if( currentLevel <= OutlineCreator.options.endLevel ) {
                    li.append(a);
                }

                // Nesting:
                // Find all current level+1 headings between this heading and the following of the same level
                var nextHeadings = heading.nextUntil('h' + currentLevel, 'h' + (currentLevel + 1));
                // If there are some create the outline for them
                if (nextHeadings.length) {
                    var nestedOutline = OutlineCreator.createOutline(nextHeadings);
                    
                    if (currentLevel <= OutlineCreator.options.endLevel && nestedOutline.children().size() !== 0 ) {
                        li.append( nestedOutline );
                    }
                }
                
            }); // /heading.each

            return ol;
        };
        
        /* --- CONSTRUCTOR --- */
        
        this.options = $.extend({}, this.defaultoptions, options);        
        
        var toc = this.createOutline($('h'+this.options.startLevel));
        $(this.options.placing).after(toc);
    };
})(jQuery);

$(document).ready(function(){
	
	if (kucss_autotoc) {
        $().createDocumentOutline({
            startLevel: 2, 
            endLevel: 2
        });
    }
	
	
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

