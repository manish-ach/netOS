"use client";

import { useState, useEffect } from 'react';

const BrowserArt = () => {
  const [asciiArt, setAsciiArt] = useState('');

  useEffect(() => {
    // Browser detection only runs on client
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
      setAsciiArt(`                **************                manish@portfolio
            **********************            -----------------
         ****************************           OS: Next.js Portfolio
       ********************************         Host: Portfolio Terminal
     ***********************************+       Kernel: React 19.1.0
    ************************************++      Uptime: Always running
   *****************      -----------------     Shell: Terminal v1.0
  ++************              --------------    Terminal: Google Chrome
 +++++*********    **********    -------------  CPU: JavaScript Engine
 ++++++******   **************   ------------   GPU: WebGL Renderer
|++++++++****   ****************   ------------ Memory: Virtual Memory
|+++++++++***  ******************  ------------ Packages: npm/pnpm
|++++++++++*-  ******************  :----------- Resolution: Browser Window
|+++++++++++*  ******************  ------------ DE: Browser UI
|+++++++++***   ****************   ------------ WM: CSS Grid/Flexbox
 +++++*******   **************   -------------  Theme: Dark Mode
 ++***********    **********    -------------   Icons: Lucide React
  **************              *-------------    Font: System Mono
   *****************      ****-------------   
    *************************-------------    
     ***********************-------------     
       ********************------------       
         *****************-----------         
            *************---------            
                ********::::--               `);
    } else if (userAgent.includes('Firefox')) {
      setAsciiArt(`                            .:                manish@portfolio
                          .:::                -----------------
                         :::::::              OS: Next.js Portfolio
                        :::::::::             Host: Portfolio Terminal
        --             :::::::::::::          Kernel: React 19.1.0
      =---   ---       :::::::::::::  :       Uptime: Always running
     ====- ===-       -=::::::::::::::: :     Shell: Terminal v1.0
    ======----- ************::::::::::::      Terminal: Mozilla Firefox
   =========-----++++++++*****::::::::::::    CPU: JavaScript Engine
  ++===========-----=++++++**::::-::::::::::  GPU: WebGL Renderer
  ++++=--------:---:::++++****:::---:::::::   Memory: Virtual Memory
 *++++++=--------:::++++++*****:::-----:::::  Packages: npm/pnpm
 *++++++++++---***+++++++++****#::::----::::: Resolution: Browser Window
 #++++++++++-##****++++++*****##----=--:::::- DE: Browser UI
  *++++++++++-##*************###----==------  WM: CSS Grid/Flexbox
  #+++++++++++-###*********####----=--------  Theme: Dark Mode
   #**++++++++++#############+=======---==-   Icons: Lucide React
   ##*****++++++++########++++============    Font: System Mono
    ###*******+++++++++++++++++++++===+===    
      ###***********++++++++++++++++++++      
       ####**************************++       
         ######**********************         
            ##############********            
               ##########******               `);
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      setAsciiArt(`                 ............                 manish@portfolio
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
 ::*..:++++++++++....----*+++++++++++++...*:: Resolution: Browser Window
 @:*..*+++++++++...----*+++++++++++++++*..*:@ DE: Browser UI
 @::*.**+++++++..---*+++++++++++++++++**.*::@ WM: CSS Grid/Flexbox
  @:*****.+++..--#*+++++++++++++++++.*****:@  Theme: Dark Mode
   ::******+.--#+++++++++++++++++++******::   Icons: Lucide React
    -::***.-#*++++++++++++++++++***.***::-    Font: System Mono
     @::**-**.****++++++++++****.**-**::@     
      @#::*********.******.**=******::#@      
        @@---**.*.*.*+**+*.*.*.**---@@        
           @@----************----@@           
              @@@------------@@@              `);
    } else if (userAgent.includes('Edge')) {
      setAsciiArt(`                   .====-                     manish@portfolio
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
  ************@%%:         ++++++++======     Resolution: Browser Window
  +**********%%%%%        +++++++++++++-      DE: Browser UI
   **********%%%%%%        ++++++++++         WM: CSS Grid/Flexbox
   .*********%%%%%%%%                         Theme: Dark Mode
    *********%%%%%%%%%%                       Icons: Lucide React
     -*******%%%%%%%%%%%%%%*      -%%%@       Font: System Mono
       *******%%%%%%%%%%%%%%%%%%%%%%%@        
         ******%%%%%%%%%%%%%%%%%%%%@          
           ******%%%%%%%%%%%%%%%%:            
              ******@%%%%%%%%%                `);
    } else {
      // Default ASCII art for unknown browsers
      setAsciiArt(`                .@@@@@@@@@@@@.                manish@portfolio
            @@@@@@@@  @@  @@@@@@@@            -----------------
         @@@@   @@    @@    @@   %@@@         OS: Next.js Portfolio
       @@@     @@     @@     @@     @@@       Host: Portfolio Terminal
     @@@      @@      @@      @@      @@@     Kernel: React 19.1.0
    @@@@@@@  @@       @@       @@  @@@@@@@    Uptime: Always running
   @@     .@@@@@@@@@@@@@%@@@@@@@@@@.     @@   Shell: Terminal v1.0
  @@        @@       :@@-       @@        @@  Terminal: Web Browser
 @@         @@        @@        @@         @@ CPU: JavaScript Engine
 @@        @@         @@         @@        @@ GPU: WebGL Renderer
@@         @@         @@         @@         @@ Memory: Virtual Memory
@@         @@         @@         @@         @@ Packages: npm/pnpm
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Resolution: Browser Window
@@         @@         @@         @@         @@ DE: Browser UI
@@         @@         @@         @@         @@ WM: CSS Grid/Flexbox
 @@        @@         @@         @@        @@  Theme: Dark Mode
 @@         @@        @@        @@         @@  Icons: Lucide React
  @@        @@       :@@.       @@        @@   Font: System Mono
   @@     .@@@@@@@@@@@@@@@@@@@@@@@@.     @@   
    @@@@@@@  @@       @@       @@  @@@@@@@    
     @@@      @@      @@      @@      @@@     
       @@@     @@     @@     @@     @@@       
         @@@%   @@    @@    @@   #@@@         
            @@@@@@@@  @@  @@@@@@@@            
                .@@@@@@@@@@@@.               `);
    }
  }, []);

  return <pre className="whitespace-pre-wrap text-[#d4d4d4] font-mono text-sm leading-relaxed">{asciiArt}</pre>;
};

export default BrowserArt;
