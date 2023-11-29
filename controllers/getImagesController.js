const imagesController = async (req, res) => {
	const { imageId } = req.params

	if (imageId) {
		if (imageId == "1") {
			const response = {
				status: 200,
				success: true,
				code: "found".toUpperCase(),
				msg: `${req.protocol}://${req.get("host")}/awse.jpg`,
			}
			res.send(response)
			return
		} else if (imageId == "2") {
			const response = {
				status: 200,
				success: true,
				code: "found".toUpperCase(),
				msg: `${req.protocol}://${req.get("host")}/feel_the_rhythm.jpg`,
			}
			res.send(response)
			return
		} else if (imageId == "3") {
			const response = {
				status: 200,
				success: true,
				code: "found".toUpperCase(),
				msg: `${req.protocol}://${req.get("host")}/wqq.jpg`,
			}
			res.send(response)
			return
		} else {
			const response = {
				status: 404,
				success: true,
				code: "not found".toUpperCase(),
				msg: `img not found`,
			}
			res.send(response)
			return
		}
	} else {
		const response = {
			status: 204,
			success: false,
			code: "no input".toUpperCase(),
			msg: "Empty search 🔍.",
		}

		res.send(response)
		return
	}
}

export { imagesController }
