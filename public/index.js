const backToTop = () => {
    const backToTopBtn = document.querySelector('.back-to-top');
    const home = document.querySelector('.section-1');
    const close = document.querySelector('.close-svg');
    const menu = document.querySelector('.show-menu');
    const sidebar = document.querySelector('.sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-li');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.add('hidden');
    });
  });

// Function to toggle the sidebar menu visibility
  const toggleMenu = () =>{
    sidebar.classList.toggle('hidden')
  }
    close.addEventListener('click', toggleMenu)
    menu.addEventListener('click', toggleMenu)
   
    // Variable to store the previous scroll position
    let oldScroll = window.scrollY;
    
    // Event listener for the scroll event
    window.addEventListener('scroll', () => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
      // Checking if the document has been scrolled up (user scrolls up)
      if (oldScroll > window.scrollY) {
        if ( window.scrollY <= 10) {
            backToTopBtn.classList.add('hidden');
        }else{
            backToTopBtn.classList.remove('hidden');
        }
      
      } else {
        if (scrollPosition >= documentHeight) {
            backToTopBtn.classList.remove('hidden'); 
            console.log('ended');
            
        }else{
            backToTopBtn.classList.add('hidden');
        }
        
        
        
      }
      
      // Updating the oldScroll value to the current scroll position
      oldScroll = window.scrollY;
    });
  
    // Back to top button click event
    backToTopBtn.addEventListener('click', () => {
      
      if (home) {
       window.scrollTo({top: 0, left:0, behavior:'smooth'});
        backToTopBtn.classList.add('hidden')
        console.log(backToTopBtn.classList);
        
      }
    });
  };
  
  // Initialize after DOM is fully loaded
  document.addEventListener('DOMContentLoaded', backToTop);
  