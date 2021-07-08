# LCS Curses Viewer
 A tool to view/edit the cpc and cmv files from Liberal Crime Squad in a browser. JSON files must be downloaded and converted to cpc from python script provided.
# Todo:
 Currently, the tool can view the pictures of cpc and cmv files. Editing in cpc files is present.
 Currently, cpc files can have existing pictures modified, but the functionality to add more pictures still is not present. 
 Editing cmv files is still too basic (can only edit pictures, not frame data). cmv files require more work as they have more 
 header information. This is due to the fact that each picture does not necessecarily correspond to a single frame - each frame can display multiple 
 pictures and each picture can appear in multiple frames. The documentation on this is not very clear, but frame details
 are found in the dummy variable.