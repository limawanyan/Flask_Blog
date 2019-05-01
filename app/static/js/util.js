function alert_success_tip(el,info,sec){
    var elem = $('<div class="tip container navbar-fixed-top text-center"><div class="row p-0 d-flex flex-wrap "><div class="col-md-5 p-2 col-md-offset-5"><div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> '+info+'</div></div></div></div>');
    el.prepend(elem)
    $('.tip').delay(sec).fadeOut();
};
			
 function alert_danger_tip(el,info,sec){
     var elem = $('<div class="tip container navbar-fixed-top text-center"><div class="row p-0 d-flex flex-wrap "><div class="col-md-5 p-2 col-md-offset-5"><div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+info+'</div></div></div></div>');
     el.prepend(elem)
     $('.tip').delay(sec).fadeOut();
 };
		
  function alert_info_tip(el,info,sec){
      var elem = $('<div class="tip container navbar-fixed-top text-center"><div class="row p-0 d-flex flex-wrap "><div class="col-md-5 p-2 col-md-offset-5"><div class="alert alert-info alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> '+info+'</div></div></div></div>');
      el.prepend(elem)
      $('.tip').delay(sec).fadeOut();
  };
	
  function alert_success_tip(el,info,sec){
      var elem = $('<div class="tip container navbar-fixed-top text-center"><div class="row p-0 d-flex flex-wrap "><div class="col-md-5 p-2 col-md-offset-5"><div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+info+'</div></div></div></div>');
      el.prepend(elem)
      $('.tip').delay(sec).fadeOut();
  };