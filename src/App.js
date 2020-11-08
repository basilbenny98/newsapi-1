import React, { useState } from "react";

const App = () => {
	const [keyword, setKeyword] = useState();
	const [articles, setArticles] = useState();
	const [selectedIndex, setSelectedIndex] = useState();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);

	const handleSearch = async (e) => {
		e.preventDefault();
		setError();
		if (keyword) {
			try {
				setLoading(true);
				const url =
					"https://6vfv8z421e.execute-api.us-east-2.amazonaws.com/test";
				const fetchResponse = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						keyword,
					}),
				});
				let data = await fetchResponse.json();
				data = JSON.parse(data.body);
				console.log("App -> data", data);
				setArticles([...data]);
				setLoading(false);
			} catch (err) {
				setError(JSON.stringify(err));
				setLoading(false);
			}
		} else {
			setError("Add a keyword to search");
		}
	};

	const handleDetails = (index) => {
		if (selectedIndex === index + 1) setSelectedIndex();
		else setSelectedIndex(index + 1);
	};

	return (
		<div>
			<form>
				<input
					type="text"
					name="keyword"
					onChange={(e) => setKeyword(e.target.value)}
				/>
				<button onClick={(e) => handleSearch(e)}>Search</button>
			</form>
			<br />
			{articles?.length ? (
				articles.map((article, i) => {
					return (
						<div key={i}>
							<h3 onClick={() => handleDetails(i)}>{article.title}</h3>
							{selectedIndex && selectedIndex === i + 1 && (
								<div>
									<br />
									<p>
										Author: {article.author}, Published At:
										{article.publishedAt}
									</p>
									<p>
										Source: <a href={article.url}>{article.url}</a>,
										<a href={article.source.name}>{article.source.name}</a>
									</p>
									<br />
									<br />
									<img src={article.urlToImage} alt="Image from article" />
									<br />
									<br />
									<p>{article.description}</p>
									<br />
								</div>
							)}
						</div>
					);
				})
			) : (
				<div>{loading ? <p>Loading...</p> : <p> No results found </p>}</div>
			)}
			{error && <p>{error}</p>}
		</div>
	);
};

export default App;
