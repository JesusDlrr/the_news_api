import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function CardDefault({ _new }) {
    return (
        <Card>
            <CardHeader color="blue-gray" className="mt-0 mx-0">
                <img
                    src={_new.image}
                    alt="card"
                />
            </CardHeader>
            <CardBody className="grow">
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    {_new.title}
                </Typography>
                <Typography>
                    {_new.article}
                </Typography>
            </CardBody>
            <CardFooter className="p-3 pt-0 align-bottom">
                <Button>
                    Read More
                    <FontAwesomeIcon className="ml-2" color="white" icon={faArrowRight} />
                </Button>
                <div className="flex justify-between mt-5">
                    <p className="text-xs underline">
                        By {_new.author}
                    </p>
                    <p className="text-xs">
                        {new Date(_new.date).toLocaleDateString('us-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>

                </div>
                <p className="text-xs mt-2">
                    {_new.city}, {_new.country}
                </p>
            </CardFooter>
        </Card>
    );
}