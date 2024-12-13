module.exports = {

    getDate: function(formatted = false) {


        if(formatted == true) {
            const now = new Date();

            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const year = String(now.getFullYear()); // Get last two digits of the year
          
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
          
            return `${day}-${month}-${year}--${hours}-${minutes}:${seconds}`; 
        }

        const now = new Date();

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = String(now.getFullYear()); // Get last two digits of the year
      
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
      
        return `[${day}-${month}-${year} ${hours}:${minutes}:${seconds}]`;

    }

}