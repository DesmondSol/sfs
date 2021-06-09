<?php 
	/**
	 * @author kevinj045/me
	 * @version 1.0.0
	 */
	class StarsManager extends loginManager
	{
		function __construct()
		{
			if(!isset($_SESSION))
        session_start();
		}

    function DBLogin()
    {

        $this->connection = mysqli_connect($this->db_host,$this->username,$this->pwd);

        if(!$this->connection)
        {   
            $this->HandleDBError("Database Login failed! Please make sure that the DB login credentials provided are correct");
            return false;
        }
        if(!mysqli_select_db($this->connection,$this->database))
        {
            $this->HandleDBError('Failed to select database: '.$this->database.' Please make sure that the database name provided is correct');
            return false;
        }
        if(!mysqli_query($this->connection,"SET NAMES 'UTF8'"))
        {
            $this->HandleDBError('Error setting utf8 encoding');
            return false;
        }

        if(!$this->CreateTable())
        {
     			return false;
        }

        return true;
    }    

    function CreateTable()
    {
    	return true;
    }

		function update()
		{

		}

		function getStarred(){
			$uname = $this->UserName();
			$s = mysqli_query($this->connection,"SELECT starred FROM $this->tablename Where username='$uname'");
			$user = mysqli_fetch_assoc($s);
			$starred = $user['starred'];
			return $starred;
		}

		function isStarred($username){
			$starred = $this->getStarred();
			if($starred == "")
			{
				return false;
			} elseif (!strpos($starred, $username))
			{
				return false;
			} else 
			{
				return true;
			}
		}

		function starUser($username)
		{	
			if($this->isStarred($username))
			{
				$this->HandleError('You already starred '.$username);
				return false;
			}

			$stars = $this->getStars($username) + 1;

			$qry = "UPDATE $this->tablename
							SET stars = $stars
							WHERE username = '$username';";
        
      if(!mysqli_query( $this->connection, $qry ))
      {
          $this->HandleDBError("Error inserting data to the table\nquery:$qry");
          return false;
      }

      if(!$this->setStarred($username))
      {
      	$this->HandleDBError("Error setting starred users");
      	return false;
      }

      return true;
		}
		
		function getStars($username = false)
		{	
			$uname = $username ? $username : $this->UserName();
			$s = mysqli_query($this->connection,"SELECT stars FROM $this->tablename Where username='$uname'");
			$user = mysqli_fetch_assoc($s);
			if(!$user)
			{
				$this->HandleError("Error, no user gotten");
				return false;
			}

			return (int)($user['stars']);
		}

		function unstarUser($username)
		{
			$stars = $this->getStars($username) - 1;

			$qry = "UPDATE $this->tablename
							SET stars = $stars
							WHERE username = '$username';";
        
      if(!mysqli_query( $this->connection, $qry ))
      {
          $this->HandleDBError("Error inserting data to the table\nquery:$qry");
          return false;
      }

      return $this->setStarred($username,true);
		}

		function setStarred($username,$remove = false)
		{
			$uname = $this->UserName();
			$s = mysqli_query($this->connection,"SELECT starred FROM $this->tablename Where username='$uname'");
			$user = mysqli_fetch_assoc($s);
			$starred = $user['starred'];
			if($starred == "")
			{
				$starred = ",".$username;
			} else {
				if(!strpos($starred, $username))
				{
					$starred = $starred.",".$username;
				}
			}

			if($remove){
				if(strpos($starred, $username))
				{	
					$starred = str_ireplace($starred, ",".$username);
				}
			} else {}

			$qry = "UPDATE $this->tablename
							SET starred = '$starred'
							WHERE username = '$uname';";
        
      if(!mysqli_query( $this->connection, $qry ))
      {
          $this->HandleDBError("Error inserting data to the table\nquery:$qry");
          return false;
      }

			return $starred;
		}

		function getUserAccount($username){
			$s = mysqli_query($this->connection,"SELECT * FROM $this->tablename Where username='$username'");
			$user = mysqli_fetch_assoc($s);
			return $user;
		}

	}
?>