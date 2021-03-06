import styles from '../../styles/Map.module.scss';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import Link from 'next/link';
import path from 'path';
import Image from 'next/image';
import type {Map} from '../../types';
import MapDownloadButtons from '../../components/MapDownloadButtons';

const fs = require('fs');

function MapNavigation({
	index,
	maps,
	position,
}: {
	index: number;
	maps: Map[];
	position: 'left' | 'right';
}) {
	return (
		<div className={`${styles.mapNavigation} ${styles[position]}`}>
			<Link href={`/maps/${maps[index].slug}`} passHref>
				<div>
					{position === 'left' ? (
						<FaChevronLeft size={42} />
					) : (
						<FaChevronRight size={42} />
					)}

					<span>{maps[index].title}</span>
				</div>
			</Link>
		</div>
	);
}

export default function Maps({maps, slug}: {maps: Map[]; slug: string}) {
	const map = maps.find((map: Map) => map.slug === slug)!;

	const isFirstMap = maps[0].slug === map.slug;
	const isLastMap = maps[maps.length - 1].slug === map.slug;

	const currentMapIndex = maps.findIndex((map: Map) => map.slug === slug);

	return (
		<div className={`${styles.mapContainer} main-container`}>
			<section
				className={`${styles.mapMainSection} ${
					isFirstMap ? styles.firstMap : ''
				} ${isLastMap ? styles.lastMap : ''}`}
			>
				{!isFirstMap && (
					<MapNavigation
						index={currentMapIndex - 1}
						maps={maps}
						position="left"
					/>
				)}

				<div className={styles.map}>
					<h1 className={styles.heading}>{map.title}</h1>

					<Image alt={map.title} src={map.coverImg} layout="fill" />
				</div>

				{!isLastMap && (
					<MapNavigation
						index={currentMapIndex + 1}
						maps={maps}
						position="right"
					/>
				)}
			</section>

			<section className={styles.mapMetadata}>
				<div className={styles.mapCategories}>
					<span className="chip">{map.category}</span>
					<span className="chip">{map.subCategory}</span>
				</div>

				<MapDownloadButtons
					bwURL="http://localhost:3000/public/bw/"
					colorURL="http://localhost:3000/public/color/"
					layout="horizontal"
				/>

				<div className={styles.mapDate}>
					<span>{`Posted on ${map.date}`}</span>
				</div>
			</section>

			<section className={styles.mapContent}>
				<p className={styles.mapLore}>{map.lore}</p>

				<p className={styles.mapNote}>{map.note}</p>
			</section>
		</div>
	);
}

export async function getStaticPaths() {
	const files = fs.readdirSync(path.join('posts'));

	const paths = files.map((filename: string) => ({
		params: {
			slug: filename.replace('.json', ''),
		},
	}));

	return {paths, fallback: false};
}

export const getStaticProps = async ({
	params: {slug},
}: {
	params: {
		slug: string;
	};
}) => {
	const files = fs.readdirSync(path.join('posts'));

	const posts = files.map((filename: string) => {
		const post = JSON.parse(
			fs.readFileSync(path.join('posts', filename), 'utf-8')
		);

		return Object.assign(post, {slug: filename.split('.')[0]});
	});

	const maps = posts.filter((post: Map) => post.category === 'map');

	return {
		props: {
			maps,
			slug,
		},
	};
};
