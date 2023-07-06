# This script removes the ".theme" classes from each file, so that they can be used in the "board specific CSS" mode, and places them in the "dynthemes" folder.
import os
for filename in os.listdir(os.getcwd() + "/themes"):
    with open(os.getcwd() + "/themes/" + filename, "r") as theme:
        with open(os.getcwd() + "/dynthemes/" + filename, "w") as dyntheme:
            for line in theme:
                dyntheme.write(line.replace('.theme_' + filename[:-4] + ' ',''))

      
