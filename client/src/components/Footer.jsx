import React from "react"

function Footer(){

  const year = new Date().getFullYear();

  return <footer className="text-center py-3 bg-dark text-white mt-auto">
    &copy; { year } Anime Blogs – All rights reserved
  </footer>
}

export default Footer;