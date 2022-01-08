import styles from '../../styles/Map.module.scss';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import Link from 'next/link';
import path from 'path';
import Image from 'next/image';

const fs = require('fs');

export default function Maps({maps, slug}: {maps: any; slug: string}) {
	const map = maps.find((map: any) => map.slug === slug);

	const isFirstMap = maps[0].slug === map.slug;
	const isLastMap = maps[maps.length - 1].slug === map.slug;

	const currentMapIndex = maps.findIndex((map: any) => map.slug === slug);

	return (
		<div className={`${styles.mapContainer} main-container`}>
			<section
				className={`${styles.mapMainSection} ${
					isFirstMap ? styles.firstMap : ''
				} ${isLastMap ? styles.lastMap : ''}`}
			>
				{!isFirstMap && (
					<div className={styles.mapNavigation}>
						<Link
							href={`/maps/${maps[currentMapIndex - 1].slug}`}
							passHref
						>
							<FaChevronLeft size={42} />
						</Link>
					</div>
				)}

				<div className={styles.map}>
					<h1 className={styles.heading}>{map.title}</h1>

					<Image src={map.coverImg} layout="fill" />
				</div>

				{!isLastMap && (
					<div className={styles.mapNavigation}>
						<Link href={`/maps/${maps[currentMapIndex + 1].slug}`}>
							<FaChevronRight size={42} />
						</Link>
					</div>
				)}
			</section>

			<section className={styles.mapMetadata}>
				<div className={styles.mapCategories}>
					<span className="chip">{map.category}</span>
					<span className="chip">{map.subCategory}</span>
				</div>

				<div className="mapDownloadButtons">
					<span>{'Download'}</span>

					<button>{'Black & White'}</button>

					<button>{'Color'}</button>
				</div>

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

	const maps = posts.filter((post: any) => post.category === 'map');

	return {
		props: {
			maps,
			slug,
		},
	};
};
