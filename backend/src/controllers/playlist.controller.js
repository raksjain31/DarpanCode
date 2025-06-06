import { db } from "../libs/db.js";

export const createPlayList = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        const playList = await db.playlist.create({
            data: {
                name,
                description,
                userId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Playlist created successfully",
            playList,
        });
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({ error: "Failed to create playlist" });
    }
};

export const getAllListDetails = async (req, res) => {
    try {

        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            message: "All Playlist Fetched successfully",
            playlists
        })


    } catch (error) {

        console.error('Error Fectching All Playlist', error);
        res.status(500).json({
            error: "Failed to Fetch All Playlist"
        });

    }

}

export const getPlayListDetails = async (req, res) => {
    try {
        const { playlistId } = req.params;

        const playlist = await db.playlist.findunique({
            where: {
                id: playlistId,
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }

        });
        if (!playlist) {
            return res.status(404).json({
                Error: "Playlist not found"
            })
        }

        res.status(200).json({
            success: true,
            message: 'Playlist fetched sucessfully',
            playlist,

        })


    } catch (error) {
        console.error('Error Fectching Playlist', error);
        res.status(500).json({
            error: "Failed to Fetch Playlist"
        });

    }


}

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body; // Accept an array of problem IDs

  try {
    // Ensure problemIds is an array
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    console.log(
      problemIds.map((problemId) => ({
        playlistId,
        problemId,
      }))
    );

    // Create records for each problem in the playlist
    const problemsInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playListId: playlistId, // ✅ match your Prisma field name exactly
        problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problems to playlist:", error.message);
    res.status(500).json({ error: "Failed to add problems to playlist" });
  }
};

export const deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const deletedplaylist = await db.playlist.findunique({
            where: {
                id: playlistId,
                //userId: req.user.id,
            }

        });

        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            deletedplaylist,
        });

    } catch (error) {
        console.error('Error Deleting Playlist:', error.message);
        res.status(500).json({
            error: "Failed to delete Playlist"

        });

    }

}
export const removeProblemFormPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                error: "Invalid or Missing Problem Id"
            })
        }

        const deletedProblem = await db.problemsInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: {
                    in: problemIds
                }
            }

        });

        res.status(200).json({
            success: true,
            message: "Problems removed from playlist successfully",
            deletedProblem
        })

    } catch (error) {
        console.error('Error Removing From Playlist:', error.message);
        res.status(500).json({
            error: "Failed to remove problem from Playlist"

        });

    }
}
