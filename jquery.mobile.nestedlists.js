(function( $, window, undefined ) {
	$.widget( "mobile.listview", $.mobile.listview, {
		options: {
			childPages: true,
			page: "<div data-role='page'></div>",
			header: "<div data-role='header'><a href='#' data-rel='back'>Back</a><h1></h1></div>",
			content: "<div class='ui-content'></div>"
		},
		_create: function(){
			//console.log("nestedList: _create");
			this._super();
			if( this.options.childPages ) {
				this._setupChildren();
			}
		},
		_setupChildren: function() {
			//console.log("nestedList: _setupChildren");
			this._attachBindings();
			this.element.find( "ul" )
				.css( "display","none" )
				.parent()
				.addClass("ui-btn ui-btn-icon-right ui-icon-carat-r");
		},
		_attachBindings: function() {
			console.log("nestedList: _attachBindings");
			this._on({
				"click": "_handleSubpageClick"
			});
			this._on( "body", {
				"pagechange": function(){
					if ( this.opening === true ) {
						this.open = true;
						this.opening = false;
					} else if ( this.open === true ) {
						this.newPage.remove();
						this.open = false;
					}
				}
			});
		},
		_handleSubpageClick: function( event ) {
			console.log("nestedList: _handleSubpageClick called");
			if( $(event.target).closest( "li" ).children( "ul" ).length == 0 ) {
				console.log("nestedList: No children");
				return;				
			}
			this.opening = true;
			this.newPage = $( this.options.page ).uniqueId();
			//console.log("nestedList: event.target = " + $( event.target ).html());
		
			if ($( event.target ).is("li")) {
				li = $( event.target );
			} else {
				li = $( event.target ).closest("li");
			}
		
			this.nestedList  = li.children( "ul" )
				.clone().attr( "data-" + $.mobile.ns + "role", "listview" )
				.css( "display", "block" );
			
			//console.log("nestedList: children = " + this.nestedList.html());
			
			this.pageName = (
				$( event.target.childNodes[0] ).text().replace(/^\s+|\s+$/g, '').length > 0 )?
				$( event.target.childNodes[0] ).text() : $( event.target.childNodes[1] ).text();
			this.pageID = this.newPage.attr( "id" );

			// Build new page
			this.newPage.append(
				$( this.options.header ).find( "h1" ).text( this.pageName ).end()
			).append(
				$( this.options.content )
			).find( "div.ui-content" ).append( this.nestedList );
			
			this.newPage.attr("id", this.pageID);
			
			$( "body" ).append( this.newPage );
			console.log("nestedList: pageID = " + this.pageID);
			// console.log("nestedList: page = " + $("#"+this.pageID).html());
				
			//$("body").pagecontainer("change", "#" + this.pageID);
			window.location.hash = this.pageID;
		    //$.mobile.initializePage();
		}
	});
})( jQuery, this );
