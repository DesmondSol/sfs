MM.define('ActionSheet',['template'],function(r,i,template){
	const Template = template[1];
	const log = console.log;

	function ActionSheet(items,options){
		var that = this;
		that.options = $.extend({}, {
			onclose: function(){},
			onopen: function(){},
			oncreate: function(){}
    }, options);
		that.items = items;
    that.actionSheetTemplate = `
    <div class="actions-backdrop" id="actionsheet_{{id}}">
	  	<div class="actions-modal modal-out">
		  	<div class="actions-group">
		  		{{#each items}}		
						<div class="actions-button {{classes}}">
							{{#if icon}}
				      	<div class="actions-button-media">{{icon}}</div>
				      {{/if}}
				      <div class="actions-button-text">{{text}}</div>
				    </div>
		  		{{/each}}
	  		</div>
	  	</div>
	  </div>`;
		that.create();
	}

	ActionSheet.prototype = ActionSheet.fn = {
		create: function CreateActionSheet(){
			var that = this;
			var id = 0;
			$('.actions-modal').each(function(){
				id++;
			});
			that.items.append({
				text: "Close",
				classes: "text-danger CloseActionSheet"
			});
			$('body').append(Template(that.actionSheetTemplate,{items:that.items,id:id}));
			that.sheet = $("#actionsheet_"+id);
			that.sheetpopup = that.sheet.find('.actions-modal');
			that.options.oncreate(that.sheet);
			that.oncreate();
		},
		oncreate: function(){
			var that = this;
			var closeBtn = that.sheet.find('.CloseActionSheet');
			that.sheet.find('.actions-button').each(function(index){
				var $ths = $(this);
				$ths.click(function(){
					if(that.items[index].onclick && isFun(that.items[index].onclick)){
						that.items[index].onclick($ths,that.sheet,that);
					} else {};
					that.close();
				});
			});
			closeBtn.off('click');
			closeBtn.click(function(){
				that.close();
			});
		},
		open: function OpenActionSheet(){
			this.options.onopen(this,this.sheet);
			this.sheet.addClass('open');
			this.sheetpopup.removeClass('modal-out').addClass('modal-in');
		},
		close: function CloseActionSheet(){
			var that = this;
			that.sheet.removeClass('open');
			that.sheetpopup.removeClass('modal-in').addClass('modal-out');
			setTimeout(function() {
				that.options.onclose(that,that.sheet);
			}, 300);
		},
		remove: function RemoveActionSheet(){
			this.sheet.remove();
		},
		removeById: function(id){
			$("#actionsheet_"+id).remove();
		}
	}


	return ActionSheet;
});