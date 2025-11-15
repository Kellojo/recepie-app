/**
 * Formats a date as a human-readable "time ago" string
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted string like "2 minutes ago", "1 hour ago", etc.
 */
export function formatTimeAgo(date: string | Date | number): string {
	const now = new Date();
	const targetDate = new Date(date);

	// Handle invalid dates
	if (isNaN(targetDate.getTime())) {
		return 'Invalid date';
	}

	const diffInMs = now.getTime() - targetDate.getTime();
	const diffInSeconds = Math.floor(diffInMs / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	const diffInWeeks = Math.floor(diffInDays / 7);
	const diffInMonths = Math.floor(diffInDays / 30);
	const diffInYears = Math.floor(diffInDays / 365);

	// Handle future dates
	if (diffInMs < 0) {
		return 'Just now';
	}

	// Less than 1 minute
	if (diffInSeconds < 60) {
		return diffInSeconds <= 5 ? 'Just now' : `${diffInSeconds} seconds ago`;
	}

	// Less than 1 hour
	if (diffInMinutes < 60) {
		return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
	}

	// Less than 1 day
	if (diffInHours < 24) {
		return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
	}

	// Less than 1 week
	if (diffInDays < 7) {
		return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
	}

	// Less than 1 month
	if (diffInDays < 30) {
		return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
	}

	// Less than 1 year
	if (diffInDays < 365) {
		return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
	}

	// 1 year or more
	return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
}

/**
 * Formats a date as a short date string (MM/DD/YYYY)
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted string like "12/25/2023"
 */
export function formatShortDate(date: string | Date | number): string {
	const targetDate = new Date(date);

	if (isNaN(targetDate.getTime())) {
		return 'Invalid date';
	}

	return targetDate.toLocaleDateString('en-US', {
		month: '2-digit',
		day: '2-digit',
		year: 'numeric'
	});
}

/**
 * Formats a date as a full date string
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted string like "December 25, 2023"
 */
export function formatFullDate(date: string | Date | number): string {
	const targetDate = new Date(date);

	if (isNaN(targetDate.getTime())) {
		return 'Invalid date';
	}

	return targetDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Formats a date with time
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted string like "Dec 25, 2023 at 3:30 PM"
 */
export function formatDateTime(date: string | Date | number): string {
	const targetDate = new Date(date);

	if (isNaN(targetDate.getTime())) {
		return 'Invalid date';
	}

	return targetDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}
