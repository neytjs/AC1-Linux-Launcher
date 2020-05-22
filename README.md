AC1 Linux Launcher is both a native Linux AC1 launcher and an account manager.

**Setup instructions**

Download and extract the release (unless you really want to install from source, for some reason). The launcher is already "installed" for you. If you click the launcher executable, it will likely prompt you with a message saying "Unknown file type" and to select a program to open it with. Click cancel and ignore this. 

You have been provided with a bash file, LauncherBashScript, to run the launcher. Open the bash script in a text editor. Replace the "/your/path/to/launcher" with the exact path to your launcher executable. Do not place quotes around the file path. Save the bash script and close. Right click on the bash script, select properties, then permissions, and make sure the checkbox is checked to "allow executing as a program."

As a test, you can now open a terminal and then drag and drop LauncherBashScript into it. After pressing enter, the launcher should now launch. You can also double click the bash script and select to run. Obviously, starting the launcher this way is not very convenient. You will probably want to create a desktop icon to easily start the launcher. 

You have been provided with a launcher.desktop file, which should work with various Ubuntu distros of Linux (including Mint) and possibly other flavors too. Open the .desktop file and replace the "/your/path/to/LauncherBashScript" with the exact full path to the bash script. Do not place quotes around the file path. Now move the launcher.desktop file to your desktop. You should now be able to easily start the launcher from your desktop.

**A few notes on basic use**

After starting the launcher, you will notice a list of servers. This is not a complete list, just the servers that I had heard of while writing this application. If you scroll to the bottom, you can see where you can add additional servers if necessary. 

You will also notice that you can add accounts. Start by adding your most used account. Clicking connect should prompt you to get the correct path to your AC1 files. Get that path, scroll up to the top and click the Add button. Paste the full file path in and save. You should now be able to press the Connect button under your newly added account and play.

If for some reason it does not launch, make sure that you have the correct .dat file to play. Also make sure that you have wine installed. If that does not do the trick, start "googling" for help. 

**Additional v1.1 notes**

Release version 1.1. adds support for importing server lists from the serverlist project: 
https://github.com/acresources/serverslist

First, clone/download their project to get the Servers.xml file. Then, open the launcher, click the new Menu button and then "Import Servers List". Now simply open the Servers.xml file to import the servers list.

Support has also been added for importing and exporting accounts lists. You can now click the Menu button and choose to either export or import an accounts list. Each accounts list is simply a .json file that holds the info for all your accounts. This should make it easier to move this important information between multiple computers you may have that also have the launcher installed.

Note for Linux Mint Cinnamon users (and possibly others), if you want your launcher icon image to appear on the Cinnamon panel, name your icon "icon.png" and place the file in your /resources/app directory. 
