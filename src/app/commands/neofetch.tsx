const neofetch = () => {
  // Browser detection
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isEdge = /Edg/.test(userAgent);
  
  let browserName = 'Unknown Browser';
  let asciiArt = '';
  
  // Chrome ASCII Art
  const chromeArt = `                **************                manish@portfolio
            **********************            -----------------
         ****************************         OS: Next.js Portfolio
       ********************************       Host: Portfolio Terminal
     ***********************************+     Kernel: React 19.1.0
    ************************************++    Uptime: Always running
   *****************      -----------------   Shell: Terminal v1.0
  ++************              --------------  Terminal: Google Chrome
 +++++*********    **********    ------------- CPU: JavaScript Engine
 ++++++******   **************   ------------ GPU: WebGL Renderer
|++++++++****   ****************   ------------Memory: Virtual Memory
|+++++++++***  ******************  ------------ Packages: npm/pnpm
|++++++++++*-  ******************  :----------- Resolution: ${typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'Unknown'}
|+++++++++++*  ******************  ------------ DE: Browser UI
|+++++++++***   ****************   ------------ WM: CSS Grid/Flexbox
 +++++*******   **************   ------------- Theme: Dark Mode
 ++***********    **********    ------------- Icons: Lucide React
  **************              *------------- Font: System Mono
   *****************      ****-------------   
    *************************-------------    
     ***********************-------------     
       ********************------------       
         *****************-----------         
            *************---------            
                ********::::--               `;

  // Firefox ASCII Art
  const firefoxArt = `                            .:                manish@portfolio
                          .:::                -----------------
                         :::::::             OS: Next.js Portfolio
                        :::::::::            Host: Portfolio Terminal
        --             :::::::::::::          Kernel: React 19.1.0
      =---   ---       :::::::::::::  :      Uptime: Always running
     ====- ===-       -=::::::::::::::: :     Shell: Terminal v1.0
    ======----- ************::::::::::::   Terminal: Mozilla Firefox
   =========-----++++++++*****::::::::::::   CPU: JavaScript Engine
  ++===========-----=++++++**::::-::::::::::  GPU: WebGL Renderer
  ++++=--------:---:::++++****:::---:::::::  Memory: Virtual Memory
 *++++++=--------:::++++++*****:::-----::::: Packages: npm/pnpm
 *++++++++++---***+++++++++****#::::----::::: Resolution: ${typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'Unknown'}
 #++++++++++-##****++++++*****##----=--:::::- DE: Browser UI
  *++++++++++-##*************###----==------  WM: CSS Grid/Flexbox
  #+++++++++++-###*********####----=--------  Theme: Dark Mode
   #**++++++++++#############+=======---==-   Icons: Lucide React
   ##*****++++++++########++++============   Font: System Mono
    ###*******+++++++++++++++++++++===+===    
      ###***********++++++++++++++++++++      
       ####**************************++       
         ######**********************         
            ##############********            
               ##########******               `;

  // Safari ASCII Art
  const safariArt = `                 ............                 manish@portfolio
            ....*++++++++++++*....            -----------------
         ...*++.+.+.++++++.+.+.++*...         OS: Next.js Portfolio
       ...*+++.+.++-++++++.++.+.+++*...       Host: Portfolio Terminal
      ..*++++.++++++++++++++++++.++++*..      Kernel: React 19.1.0
    ..**++.++++++++++++++++++++++++:*+**..    Uptime: Always running
   ..*:++++++++++++++++++++++++++*#++++:*..   Shell: Terminal v1.0
  -.**.++.+++++++++++++++++++++***++.++.**.-  Terminal: Safari
  ..*..++++++++++++++++++++++***+++++++..*..  CPU: JavaScript Engine
 -.*..+++++++++++++++++++++***++++++++++..*.- GPU: WebGL Renderer
 ::*....++++++++++++.++++****+++++++++....*:: Memory: Virtual Memory
 ::*..+++++++++++++....****+++++++++++++..*:: Packages: npm/pnpm
 ::*..:++++++++++....----*+++++++++++++...*:: Resolution: ${typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'Unknown'}
 @:*..*+++++++++...----*+++++++++++++++*..*:@ DE: Browser UI
 @::*.**+++++++..---*+++++++++++++++++**.*::@ WM: CSS Grid/Flexbox
  @:*****.+++..--#*+++++++++++++++++.*****:@  Theme: Dark Mode
   ::******+.--#+++++++++++++++++++******::   Icons: Lucide React
    -::***.-#*++++++++++++++++++***.***::-    Font: System Mono
     @::**-**.****++++++++++****.**-**::@     
      @#::*********.******.**=******::#@      
        @@---**.*.*.*+**+*.*.*.**---@@        
           @@----************----@@           
              @@@------------@@@              `;

  // Edge ASCII Art
  const edgeArt = `                   .====-                     manish@portfolio
             .==================              -----------------
          -========================           OS: Next.js Portfolio
        =============================         Host: Portfolio Terminal
      .==============================-=       Kernel: React 19.1.0
     ===============================----      Uptime: Always running
    ====#######*#*###*===============----     Shell: Terminal v1.0
   ==####*************##===========-------    Terminal: Microsoft Edge
   =##*****************##%==========------    CPU: JavaScript Engine
  +##*************%       #====+=====--=-=    GPU: WebGL Renderer
  *#************@=         =++++==========    Memory: Virtual Memory
  *************%%          ++++++=========    Packages: npm/pnpm
  ************@%%:         ++++++++======     Resolution: ${typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'Unknown'}
  +**********%%%%%        +++++++++++++-      DE: Browser UI
   **********%%%%%%        ++++++++++         WM: CSS Grid/Flexbox
   .*********%%%%%%%%                         Theme: Dark Mode
    *********%%%%%%%%%%                       Icons: Lucide React
     -*******%%%%%%%%%%%%%%*      -%%%@       Font: System Mono
       *******%%%%%%%%%%%%%%%%%%%%%%%@        
         ******%%%%%%%%%%%%%%%%%%%%@          
           ******%%%%%%%%%%%%%%%%:            
              ******@%%%%%%%%%                `;

  // Default ASCII Art (for unknown browsers)
  const defaultArt = `                .@@@@@@@@@@@@.                manish@portfolio
            @@@@@@@@  @@  @@@@@@@@            -----------------
         @@@@   @@    @@    @@   %@@@         OS: Next.js Portfolio
       @@@     @@     @@     @@     @@@       Host: Portfolio Terminal
     @@@      @@      @@      @@      @@@     Kernel: React 19.1.0
    @@@@@@@  @@       @@       @@  @@@@@@@    Uptime: Always running
   @@     .@@@@@@@@@@@@@%@@@@@@@@@@.     @@   Shell: Terminal v1.0
  @@        @@       :@@-       @@        @@  Terminal: Unknown Browser
 @@         @@        @@        @@         @@ CPU: JavaScript Engine
 @@        @@         @@         @@        @@ GPU: WebGL Renderer
@@         @@         @@         @@         @@Memory: Virtual Memory
@@         @@         @@         @@         @@Packages: npm/pnpm
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Resolution: ${typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'Unknown'}
@@         @@         @@         @@         @@DE: Browser UI
@@         @@         @@         @@         @@WM: CSS Grid/Flexbox
 @@        @@         @@         @@        @@ Theme: Dark Mode
 @@         @@        @@        @@         @@ Icons: Lucide React
  @@        @@       :@@.       @@        @@  Font: System Mono
   @@     .@@@@@@@@@@@@@@@@@@@@@@@@.     @@   
    @@@@@@@  @@       @@       @@  @@@@@@@    
     @@@      @@      @@      @@      @@@     
       @@@     @@     @@     @@     @@@       
         @@@%   @@    @@    @@   #@@@         
            @@@@@@@@  @@  @@@@@@@@            
                .@@@@@@@@@@@@.               `;

  if (isChrome) {
    browserName = 'Google Chrome';
    asciiArt = chromeArt;
  } else if (isFirefox) {
    browserName = 'Mozilla Firefox';
    asciiArt = firefoxArt;
  } else if (isSafari) {
    browserName = 'Safari';
    asciiArt = safariArt;
  } else if (isEdge) {
    browserName = 'Microsoft Edge';
    asciiArt = edgeArt;
  } else {
    browserName = 'Unknown Browser';
    asciiArt = defaultArt;
  }

  return `${asciiArt}

🎨 Welcome to my portfolio terminal! Type 'help' for available commands.`;
};

export default neofetch;