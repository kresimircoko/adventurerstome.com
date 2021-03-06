import Link from 'next/link';
import Image from 'next/image';
import React, {useState} from 'react';
import styles from '../styles/Maps.module.scss';
import path from 'path';
import MapDownloadButtons from './../components/MapDownloadButtons';
import type {Map} from '../types';

const fs = require('fs');

export default function maps({
	maps,
	categories,
}: {
	maps: Map[];
	categories: string[];
}) {
	const [currentMap, setCurrentMap] = useState(maps[0]);

	return (
		<div className={`main-container ${styles.mapsViewContainer}`}>
			<section className={styles.smallView}>
				<ul>
					{maps.map((map: Map) => (
						<li
							className={
								map.title === currentMap.title
									? styles.active
									: ''
							}
							key={map.title}
							onClick={() => setCurrentMap(map)}
						>
							<h3>{map.title}</h3>

							<div className={styles.smallImageContainer}>
								<img alt={map.title} src={map.coverImg} />
							</div>
						</li>
					))}
				</ul>
			</section>

			<section className={styles.bigView}>
				<div className={styles.interactive}>
					<Link href={`/maps/${currentMap.slug}`} passHref>
						<button className={styles.viewButton}>
							{'View Post'}
						</button>
					</Link>

					<h1 className={styles.bigImageTitle}>{currentMap.title}</h1>

					<MapDownloadButtons
						bwURL="http://localhost:3000/public/bw/"
						colorURL="http://localhost:3000/public/color/"
						layout="vertical"
					/>
				</div>

				<div className={styles.bigImageContainer}>
					<Image
						alt={currentMap.title}
						layout="fill"
						objectFit="contain"
						priority
						src={currentMap.coverImg}
					/>
				</div>
			</section>
		</div>
	);
}

export async function getStaticProps() {
	const files = fs.readdirSync(path.join('posts'));

	const posts = files.map((filename: string) => {
		const post = JSON.parse(
			fs.readFileSync(path.join('posts', filename), 'utf-8')
		);

		return post;
	});

	const maps = posts.filter((post: Map) => post.category === 'map');

	const mapCategories: string[] = maps.map((map: Map) => map.subCategory);

	const categories: string[] = mapCategories.filter(
		(category: string, index: number) =>
			mapCategories.indexOf(category) === index
	);

	return {
		props: {
			maps,
			categories,
		},
	};
}
