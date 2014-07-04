/* 
	Quick_Fdit, a simple formula editor based on MathQuill, jQuery/jQueryUI, and awesomeFont.
*/
$.widget( "artheru.quickfdit", {
	vars:{
		qfditui:undefined,
		target:undefined
	},
	
	initOnce: function(){
		function generateSelector(obj){
			var matharr=[
				{x:294,y:6,w:2,h:3,symb:"\\sum^{}_{}"},
				{x:407,y:6,w:2,h:3,symb:"\\prod^{}_{}"},
				{x:142,y:135,w:2,h:2,symb:"\\lim_{}"},
				{x:238,y:135,w:2,h:2,symb:"\\min_{}"},
				{x:313,y:137,w:2,h:2,symb:"\\max_{}"},
				{x:233,y:84,w:2,h:2,symb:"\\binom",c:1},
				{x:12,y:18,w:1,h:2,symb:"\\frac",c:1},
				{x:138,y:96,w:2,h:1,symb:"\\lfloor \\rfloor"},
				{x:92,y:65,w:2,h:1,symb:"\\lceil \\rceil"},
				{x:41,y:99,w:2,h:1,symb:"|",c:1},
				{x:143,y:64,w:1,h:1,symb:"\\bar",c:1},
				{x:174,y:64,w:1,h:1,symb:"\\vec",c:1},
				{x:318,y:250,w:1,h:1,symb:"|"},
				{x:152,y:29,w:2,h:1,symb:"\\sqrt",c:1},
				{x:193,y:29,w:2,h:1,symb:"\\sqrt[]{}"},
				{x:52,y:31,w:1,h:1,symb:"^",c:1},
				{x:93,y:29,w:1,h:1,symb:"_",c:1},
				{x:125,y:29,w:1,h:1,symb:"_{}^{}"},
				{x:45,y:147,w:3,h:1,symb:"\\log_{}"},
				{x:392,y:146,w:2,h:1,symb:"\\ln",c:1},
				{x:228,y:275,w:1,h:1,symb:"\\to"},
				{x:15,y:190,w:2,h:1,symb:"\\sin",c:1},
				{x:82,y:189,w:2,h:1,symb:"\\cos",c:1},
				{x:155,y:189,w:2,h:1,symb:"\\tan",c:1},
				{x:397,y:273,w:2,h:1,symb:"\\quad"},
				{x:444,y:273,w:2,h:1,symb:"\\vector",c:1},
				{x:40,y:220,w:1,h:1,symb:"\\pm"},
				{x:62,y:220,w:1,h:1,symb:"\\mp"},
				{x:82,y:220,w:1,h:1,symb:"\\times"},
				{x:100,y:220,w:1,h:1,symb:"\\div"},
				{x:204,y:220,w:1,h:1,symb:"\\inf"},
				{x:227,y:220,w:1,h:1,symb:"\\neq"},
				{x:268,y:220,w:1,h:1,symb:"\\equiv"},
				{x:306,y:220,w:1,h:1,symb:"\\propto"},
				{x:428,y:220,w:1,h:1,symb:"\\exists"},
				{x:406,y:220,w:1,h:1,symb:"\\forall"},
				{x:35,y:276,w:1,h:1,symb:"\\le"},
				{x:64,y:276,w:1,h:1,symb:"\\ge"},
				{x:112,y:276,w:1,h:1,symb:"\\emptyset"},
				{x:278,y:276,w:1,h:1,symb:"\\neg"},
				{x:357,y:275,w:1,h:1,symb:"\\subset"},
				{x:378,y:275,w:1,h:1,symb:"\\superset"},
				{x:86,y:250,w:1,h:1,symb:"\\in"},
				{x:106,y:250,w:1,h:1,symb:"\\notin"},
				{x:59,y:250,w:1,h:1,symb:"\\cap"},
				{x:32,y:250,w:1,h:1,symb:"\\cup"},
				{x:352,y:250,w:1,h:1,symb:"\\parallel"},
				{x:395,y:250,w:1,h:1,symb:"\\perp"},
				{x:468,y:220,w:1,h:1,symb:"\\angle"},
				{x:10,y:305,w:1,h:1,symb:"\\alpha"},
				{x:27,y:305,w:1,h:1,symb:"\\beta"},
				{x:46,y:305,w:1,h:1,symb:"\\gamma"},
				{x:63,y:305,w:1,h:1,symb:"\\delta"},
				{x:80,y:305,w:1,h:1,symb:"\\varepsilon"},
				{x:96,y:305,w:1,h:1,symb:"\\zeta"},
				{x:112,y:305,w:1,h:1,symb:"\\eta"},
				{x:130,y:305,w:1,h:1,symb:"\\theta"},
				{x:148,y:305,w:1,h:1,symb:"\\lambda"},
				{x:166,y:305,w:1,h:1,symb:"\\mu"},
				{x:184,y:305,w:1,h:1,symb:"\\nu"},
				{x:199,y:305,w:1,h:1,symb:"\\xi"},
				{x:216,y:305,w:1,h:1,symb:"\\pi"},
				{x:235,y:305,w:1,h:1,symb:"\\rho"},
				{x:252,y:305,w:1,h:1,symb:"\\sigma"},
				{x:271,y:305,w:1,h:1,symb:"\\varphi"},
				{x:291,y:305,w:1,h:1,symb:"\\phi"},
				{x:312,y:305,w:1,h:1,symb:"\\psi"},
				{x:391,y:305,w:1,h:1,symb:"\\Phi"},
				{x:413,y:305,w:1,h:1,symb:"\\Psi"},
				{x:435,y:305,w:1,h:1,symb:"\\Omega"},
				{x:456,y:305,w:1,h:1,symb:"\\Pi"},
				{x:480,y:305,w:1,h:1,symb:"\\partial"}
			];
			var content=$("<div>");
			$.each(matharr,function(){
				var symb=this.symb,
					c=this.c;
				var li=$("<li>")
					.addClass("quickfdit-ui-mathbutton")
					.css('background-position',-this.x + "px " + -this.y + "px")
					.css('width',this.w*25) //total 15w for 300px
					.css('height',this.h*25)
					.css('cursor','pointer')
				if (c) 
					li.click(function(){
						obj.target
							.mathquill("cmd", symb)
						obj.refresh();
					})
				else
					li.click(function(){
						obj.target
							.mathquill("write", symb)
						obj.refresh();
					})
				li.appendTo(content);
			});
			$("<div>").css({"clear":"both"}).appendTo(content);
			return content;
		}
		function generateToolbar(obj){
			var toolbar=$("<div>")
				.addClass("quickfdit-ui-toolbar");
			var close=$("<div>")
				.addClass("close")
				.append('<i class="fa fa-times" /i>')
				.click(function(){
					obj.qfditui.hide(); 
					obj.target.focus()
					obj.closed=true;
				});
			var buttons=[
				function(){ //help
					return $("<div>")
						.append('<i class="fa fa-question"/i>')
						.tooltip({items:"div",content:"Help!"})
						.click(function(){alert('hi')});
				},
				function(){//switch between latex code/visual edit
					return $("<div>")
						.append('<i class="fa fa-file-code-o" /i>')
						.tooltip({items:"div",content:"Click this to toggle LaTeX code and visual editor!"})
						.click(function(){
							$(this).toggleClass("switcherOn");
							if ($(this).hasClass("switcherOn")){
								var latex=obj.target.mathquill("latex");
								obj.target
									.mathquill("revert")
									.text(latex)
									.attr("contenteditable","true");
								obj.refresh();
							}else{
								obj.target
									.attr("contenteditable","false")
									.mathquill("editable");
								obj.refresh();
							}
						});
				}
			];
			$.each(buttons,function(){
				toolbar.append(this().addClass("button"));
			});
			toolbar.append(close);
			return toolbar;
		}
		var param=this.vars;
		var qfditui=$("<div>")
			.addClass("quickfdit-ui")
			.appendTo($("body"))
			.append(generateToolbar(param))
			.append(generateSelector(param))
			.hide();
		this.vars.qfditui=qfditui;
		return qfditui;
	},
	
  // the constructor
	_create: function() {
		//Buttons
		if (!this.vars.qfditui)
			this.initOnce();
		var element=this.element;
		var param=this.vars;
		
		element.mathquill('editable');		
		function refresh(){
			param.closed=false;
			param.target=element;
			param.refresh=refresh;
			param.qfditui
				.show()
				.position({
					of:element,
					my:"left top+5",
					at:"left bottom",
					collision:"none fit"
				});
			element.focus();
			//console.log("refresh"+element);
		}		
		element.keydown(function(){
			if (!param.closed) setTimeout(refresh,100);
			//console.log("kd");
		})
		element.click(refresh)		
	},

	_destroy: function() {
		this.qfditui.remove();
	},

});