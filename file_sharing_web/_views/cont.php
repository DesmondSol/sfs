<div class="container-fluid">
	<div class="container">
		<form class="content" id="share_form">

			<div class="field">
			  <input id="filename" name="filename" type="text" class="form-control input-default" placeholder="Name">
			</div>

			<div class="field">
			  <input id="link" name="link" type="text" class="form-control input-default"
			  placeholder="Google Drive Link">
			</div>

			<div class="field">
			  <label for="type">Catagory/Subject</label>
			  <select id="type" name="type" class="form-control">
			  	<!-- JavaScript will take care of the catagories here -->
			  </select>
			</div>

			<div class="field">
			  <label for="catagory">Catagory/catagory</label>
			  <select id="catagory" name="catagory" class="form-control">
			  	<option value="natural" selected="">Natural</option>
			  	<option value="social">Social</option>
			  </select>
			</div>

			<div class="field">
			  <textarea id="about" name="about" type="text" class="form-control" data-length="300" placeholder="About The Post"></textarea>
			</div>

			<button class="btn button w-100" type="submit">
				Share
			</button>
		</form>
	</div>
</div>