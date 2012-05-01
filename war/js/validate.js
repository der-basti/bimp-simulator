function validateXORs() {
	$(".xor").each(function (){
		validateXOR(this);
	}); 
}
function validateXOR(xor) {
	var percentage = 0;
	$(xor).find(".probability").each(function() {
		percentage = percentage + Number($(this).val());
	});
	if(percentage != 100) {
		if(!$(xor).next().hasClass("error")) {
			$(xor).after("<div class='error'> Your XOR gateway percentages do not sum up to 100%! </div>");
		}	
	} else {
		if($(xor).next().hasClass("error")) {
			$(xor).next().remove();
		}
	}
}

function validateRequiredFields() {
	$.each(validate, function(name, content) {
		if(validate[name].required == true) {
			$(validate[name]["class"]).each(function() {
				if($(this).val()== "" && !$(this).next().hasClass("error")) {
					$(this).after(errorTooltip('This field is required!', this));
				} else {
					if($(this).next().hasClass("error")) {
						$(this).next().remove();
					}
				}
			});
		}
	});
}

function validateFields() {
	$.each(validate, function(name, content) {
		$(validate[name]["class"]).each(function () {
			validate.validateField(this, name);
		});
	});
}

function validateForm() {
	validateXORs();
	validateRequiredFields();
	validateFields();
	if($(".error").size() == 0) {
		return true;
	} else {
		$("<div></div>").html("Your form has errors! Follow the requirements and try again.").dialog({width : "300px", title: "Error!", buttons: { "Ok": function() { $(this).dialog("close"); } }, resizable: false });
		return false;
	}
}

function errorTooltip(msg, field) {
	var div = jQuery('<div/>', {  
		css: {
			position: "absolute",
			top: $(field).position().top - 22 + "px",
			left: $(field).position().left - 185 + "px",
			width: "180px",
			border: "1px solid #AAA",
			padding: "1px",
			'text-align': "center",
			'border-radius': "7px",
			'border-bottom-right-radius': "0"
		}
	});
	$(div).append(jQuery('<span/>', {text:msg}));
	
	$(div).addClass('error');
	return div;
}

validate = {
		validateField : function (element, name) {
			if(validate[name].regexp && !(new XRegExp(validate[name].regexp)).test($(element).val())) {
				if($(element).next().hasClass("error")){
					$(element).next().remove();
				}
				$(element).after(errorTooltip(validate[name].msg, element));				
			} else if (validate[name].custom && !validate[name].custom($(element).val())) {
				if($(element).next().hasClass("error")){
					$(element).next().remove();
				}
				$(element).after(errorTooltip(validate[name].customMsg, element));				
			} else {
				if($(element).next().hasClass("error")) {
					$(element).next().remove();
				}
			}
		},
		  fixedCost: {
			  "class": ".fixedCost",
			  regexp: "^([0-9]*|[0-9]+(\\.[0-9]+))$",
			  msg: "For decimal place, use a point!"
		  },
		  instances: {
			  "class": ".instances",
			  required: true,
			  regexp: "^[0-9]+$",
			  custom: function (value) {
				  try {
					  var val = Number(value);
				  if(val > 100000) {
					  validate.instances.customMsg = validate.instances.msg2;
					  return false;
					} else if(val > 10000 && $("#mxmlLog").is(':checked')) {
						validate.instances.customMsg = validate.instances.msg3;
						return false;
					} else if (val < 1){
						validate.instances.customMsg = validate.instances.msg;
						return false;
					} else {
						return true;
					}
				  } catch (e) {
					  validate.instances.customMsg = validate.instances.msg;
					  return false;
				  }
			  },
			  msg: "This field has to be a positive integer!",
			  customMsg: "",
			  msg2: "The maximum allowed number of instances is 100000!",
			  msg3: "You selected logging - The maximum allowed number of instances is 10000!",
		  },
		  name: {
			  "class": ".resources .name",
			  required: true
		  },
		  amount: {
			  "class": ".amount",
			  required: true,
			  regexp: "^[0-9]+$",
			  msg: "This field has to be a positive integer!"
		  },
		  costPerHour: {
			  "class": ".costPerHour",
			  regexp: "^([0-9]*|[0-9]+(\\.[0-9]+))$",
			  msg: "For decimal place, use a point!"
		  },
		  probability: {
			  "class": ".probability",
			  regexp: "^((100)|([0-9]{0,2})|[0-9]{0,2}(\\.[0-9]{0,2}))$",
			  msg: "Invalid percentage!"
		  }  
		};