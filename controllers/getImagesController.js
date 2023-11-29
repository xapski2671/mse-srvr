const imagesController = async (req, res) => {
	const { imageId } = req.params

	if (imageId) {
		if (imageId == "1") {
			const response = {
				status: 200,
				success: true,
				code: "found".toUpperCase(),
				image:
					"https://images.unsplash.com/photo-1700730025710-58ff304c1c8b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				// msg: `${req.protocol}://${req.get("host")}/awse.jpg`,
			}
			res.send(response)
			return
		} else if (imageId == "2") {
			const response = {
				status: 200,
				success: true,
				code: "found".toUpperCase(),
				image:
					"https://images.unsplash.com/photo-1701017655822-d4f7a0569b40?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			}
			res.send(response)
			return
		} else if (imageId == "3") {
			const response = {
				status: 200,
				success: true,
				code: "found".toUpperCase(),
				image:
					"https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
