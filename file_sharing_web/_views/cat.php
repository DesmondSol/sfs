<div class="container-fluid">
	<div class="container">
		<br>
		<div class="list-group buddings"style="overflow-x:auto;">
			<button class="btn active sortBtn" sort="reverse">Newest</button>
			<button class="btn sortBtn" sort="real">Older</button>
			<br>
			<button class="btn fiterBtn" filter="natural">Natural</button>
			<button class="btn fiterBtn" filter="social">Social</button>
			<a class="btn fiterBtnAll active" href="#catagories&all/all">All</a>
		</div>
		<div class="tab-content">
			<div role="tabpanel" class="tab-pane" id="natural">
				<div class="list-group buddings" style="overflow-x:auto;">
					{{#each catagories.natural}}
						<a class="btn active" href="#catagories&natural/{{value}}">{{value}}</a>
					{{/each}}
			    </div>
			  </div>
			  <div role="tabpanel" class="tab-pane" id="social">
				<div class="list-group buddings" style="overflow-x:auto;">
					{{#each catagories.social}}
						<a class="btn active" href="#catagories&social/{{value}}">{{value}}</a>
					{{/each}}
			    </div>
	  		</div>
	  	</div>
	</div>
	<div id="list"></div>
</div>